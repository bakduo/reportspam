
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
        const Message = await this.repo.getId(req.params.id);
        return res.status(200).json({SUCCESS:Message});
      }

      return res.status(400).json({ error: "Message not exist" });
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
       const item =  await this.repo.updateById(req.params.id,req.body)
       if (item){
        if (this.mqs.publishToQueue(JSON.stringify({type:'update',data:message}))){
          return res.status(200).json({SUCCESS:item});
        };
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

        const existe = await this.repo.deleteById(req.params.id);

        if (existe){
          if (this.mqs.publishToQueue(JSON.stringify({type:'delete',data:req.params.id}))){
            return res.status(200).json({SUCCESS:existe});
          };
        }

      }
      
      return res.status(400).json({ error: "Message not exist." });

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
