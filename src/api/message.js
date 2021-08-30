
/**
 * MessageController about message
 * 
 * @class MessageController
 * @constructor
 */
class MessageController {
  constructor(repo,mqs){
     this.repo = repo;
     this.mqs = mqs;    
  }


/** 
 * @method getAll
 * @description get All messages
 */
  getAll = async (req, res, next) => {
    try {

      this.repo.getItems()
      .then(lista => {

        if (lista){
          return res.status(200).json(lista);
        }

        return res.status(400).json({ error: "Messages empty" });
      })
      .catch((err)=>{
        return res.status(400).json({ error: err });
      })

     
    } catch (error) {
      throw Error(error);
    }
  };



  /**
   * [async save]
   *
   * @param   {[type]}  req   [req description]
   * @param   {[type]}  res   [res description]
   * @param   {[type]}  next  [next description]
   *
   * @return  {[type]} Message  [return Message]
   */
  save = async (req, res, next) => {
    try {
      if (req.body) {

        const email = await this.repo.findMulti({'email':req.body.email},{'domain':req.body.domain},{'ip':req.body.ip});
                
        if (email.length>0){
          return res.status(200).json({ status: 'Email reported' });    
        }

        const message = await this.repo.save(req.body);
        if (message){
          if (this.mqs.publishToQueue(JSON.stringify({type:'save',data:message}))){
            return res.status(201).json({SUCCESS:message});
          }
        }

      }
      return res.status(400).json({ status: 'Body not valid' });
    } catch (error) {
      res.status(500).send(error);
      throw Error(error);
    }
  };

  /**
   * [async get]
   *
   * @param   {[type]}  req   [req an ID message]
   * @param   {[type]}  res   [res description]
   * @param   {[type]}  next  [next description]
   *
   * @return  {[type]}  Message  [return Message]
   */
  get = async (req, res, next) => {
    try {

      if (req.params.id) {
      
        //Async for performance
        this.repo.getId(req.params.id)
        .then((value)=>{
          if (value){
            return res.status(200).json({SUCCESS:value});
          }else{
            return res.status(400).json({ error: "Message not exist" });
          }
          
        })
        .catch((error)=>{
          return res.status(500).json({error:error});
        })
        
      }
    } catch (error) {
      res.status(500).send(error);
      throw Error(error);
    }
  };

  /**
   * [async update]
   *
   * @param   {[type]}  req   [req an ID message]
   * @param   {[type]}  res   [res description]
   * @param   {[type]}  next  [next description]
   *
   * @return  {[type]} Message  [return Message]
   */
  update = async (req, res, next) => {
    try {
      if (req.params.id) {
        const existe = await this.repo.getId(req.params.id) 
        if (existe){
          const item = await this.repo.updateById(req.params.id,req.body)
          if (item){
            if (this.mqs.publishToQueue(JSON.stringify({type:'save',data:item}))){
              return res.status(200).json({SUCCESS:item});
            };
          }
        }
      }
      return res.status(400).json({ error: "Product not exist" });
    } catch (error) {
      res.status(500).send(error);
      throw Error(error);
    }
  };

  /**
   * [async delete]
   *
   * @param   {[type]}  req   [req an ID message]
   * @param   {[type]}  res   [res description]
   * @param   {[type]}  next  [next description]
   *
   * @return  {[type]}  Message   [return Message]
   */
  delete = async (req, res, next) => {
    try {
      
      if (req.params.id){

        const existe = await this.repo.getId(req.params.id);
        if (existe){
          const ok = await this.repo.deleteById(req.params.id);
          if (existe){
            if (this.mqs.publishToQueue(JSON.stringify({type:'delete',data:existe}))){
              return res.status(200).json({SUCCESS:ok});
            };
          }
        }
      }
      
      return res.status(404).json({error:"The record doesn't exist"});

    } catch (error) {
      res.status(500).send(error);
      throw Error(error);
    }
  };

  deleteAll = async (req, res, next) => {
    try {
      
      
        const existe = await this.repo.deleteAll();

        if (existe){
          if (this.mqs.publishToQueue(JSON.stringify({type:'deleteAll',data:'All'}))){
            return res.status(200).json({SUCCESS:existe});
          };
        }
      
      return res.status(400).json({ error: "Message not exist." });

    } catch (error) {
      res.status(500).send(error);
      throw Error(error);
    }
  };

}

module.exports = MessageController;
