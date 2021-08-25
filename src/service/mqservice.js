const amqp = require('amqplib');

const config = require('../config/index');

const mqconfig = config.mqservice;

const _ = require('lodash');

/**
 * [MQService service message broker]
 * @constructor
 * @param nombre de la queue
 */
class MQService {

    static instancia;

    constructor() {

        if (!!MQService.instancia) {
            return MQService.instancia;
        }
        
        this.url = `amqp://${mqconfig.user}:${mqconfig.passwd}@${mqconfig.host}:${mqconfig.port}/${mqconfig.vhost}`
        this.channel = null;
        this.name = mqconfig.queue;
        this.routerkey=mqconfig.routerkey;
        this.exchange = mqconfig.exchange;
        this.connectionRabbit = null;
        this.queues = {};

        this.init();
        
        MQService.instancia = this;  
        
    }

    searchQueueName(name){
        return _.find(this.queues[name], h => h === handler);
    }

    init(){
        const initConnection = async () => {
            await this.connection();
        }
        initConnection();
    }

    async connection() {
        this.connectionRabbit = await amqp.connect(this.url + "?heartbeat=60");
        this.channel = await this.connectionRabbit.createChannel();
        await this.channel.assertQueue(this.getQueueName(), {durable: true});
        await this.channel.assertExchange(this.getExchangeName(), 'fanout',{durable: true});
        await this.channel.bindQueue(this.getQueueName(),this.getExchangeName(),this.getRouterKey());
        
        //await this.channel.assertExchange(this.getQueueName(), 'fanout', { durable: true})
    }

    setQueueName(name){
        this.name = name;
    }

    setRouterKey(key){
        this.routerkey = key;
    }

    setExchangeName(name){
        this.exchange = name;
    }

    getExchangeName(){
        return this.exchange;
    }

    getQueueName(){
        return this.name;
    }

    getRouterKey(){
        return this.routerkey;
    }


    close(){
        this.channel.connection.close();    
        this.connectionRabbit.close();
    }

    publishToQueue = async (data) => {
        try {
            //await this.channel.assertQueue(this.getQueueName(), {durable: true});
            // return this.channel.sendToQueue(this.getQueueName(), Buffer.from(data),{
            //     persistent: true
            // });
            this.channel.publish(this.getExchangeName(),this.getRouterKey(),Buffer.from(data),{
                persistent: true 
            })
            
        } catch (error) {
            throw new Error(error);
        }
    }

    //Thanks https://medium.com/swlh/communicating-using-rabbitmq-in-node-js-e63a4dffc8bb

    /**
     * [async subcribe]
     *
     * @param   {[type]}  queue    [queue name queue]
     * @param   {[type]}  handler  [handler callback ack]
     *
     * @return  {[type]}           [return callback]
     */
    subscribe = async (queue, handler) =>{
        
        if (!this.connectionRabbit) {
          throw new Error("Connection don't exists");
        }

        if (this.queues[queue]) {

            const exists = this.searchQueueName(queue);
            if (exists) {
                return () => this.unsubscribe(queue, existingHandler)
            }
            this.queues[queue].push(handler)
            return () => this.unsubscribe(queue, handler)
        }

        await this.channel.assertQueue(queue, {durable: true});

        this.queues[queue] = [handler]
        
        this.channel.consume(
            queue,
            async (msg) => {
                const ack = _.once(() => this.channel.ack(msg))
                this.queues[queue].forEach(h => h(msg, ack))
            }
        );
        return () => this.unsubscribe(queue, handler)
    }
    
    /**
     * [unsubscribe delete value of array]
     *
     * @param   {[type]}  queue    [queue description]
     * @param   {[type]}  handler  [handler description]
     *
     * @return  {[type]}           [return description]
     */
    async unsubscribe(queue, handler) {

        _.pull(this.queues[queue], handler);
    
    }
 
}


 module.exports = MQService;