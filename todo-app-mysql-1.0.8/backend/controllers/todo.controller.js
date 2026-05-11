const Todo = require('../models/todo.model'); 
const { redisClient } = require('../config/database'); 

const TodoController = {

  createTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const { text, date } = req.body;
      const result = await Todo.create({
        text: text,
        date: date,
        completed: false,
        user_id: user_id
      });

      return res.status(201).json(result);
    } catch (error) {
      console.error('ADD TODO: ', error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  },

  getAllTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const result = await Todo.find({ user_id: user_id })
                               .sort({ date: 1 })
                               .select('-user_id');

      if (result) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ message: "Non trouvé" });
      }
    } catch (error) {
      console.error('GET ALL TODO: ', error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  },

  editTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const query = { _id: req.params.id, user_id: user_id };
      const data = req.body;

      const result = await Todo.findOne(query);

      if (result) {
        result.completed = data.completed !== undefined ? data.completed : result.completed;
        result.text = data.text ? data.text : result.text;
        result.date = data.date ? data.date : result.date;

        await result.save();
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ message: "Non trouvé" });
      }
    } catch (error) {
      console.error('UPDATE TODO: ', error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  },

  deleteTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const todo_id = req.params.id;
      const query = { _id: todo_id, user_id: user_id };

      await Todo.deleteOne(query);
      
      return res.status(200).json({ id: todo_id });
    } catch (error) {
      console.error('DELETE TODO: ', error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  },

  getSearchTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const query = req.query.q;
      const cacheKey = `search:${user_id}:${query}`;

      // check si redis deja en memoire
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        // Si oui, on renvoie directement les données du cache
        return res.status(200).json(JSON.parse(cachedData));
      }

      // i == "case-insensitive"
      const result = await Todo.find({
        user_id: user_id,
        text: { $regex: query, $options: 'i' }
      })
      .sort({ date: 1 })
      .select('-user_id');

      if (result) {
        //une heure de cache dans redis
        await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 });
        
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ message: "Non trouvé" });
      }
    } catch (error) {
      console.error('SEARCH TODO: ', error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }
};

module.exports = TodoController;