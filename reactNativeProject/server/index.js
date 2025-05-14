
//index.js
const express = require('express'); //ספריית אקספרס מדמה לנו סוג של שרת
const mongoose = require('mongoose'); //MONGODB
const cors = require('cors'); //להעביר קריאות ממקומות שונים לדומיינים אחרים
const bodyParser = require('body-parser'); //תרגום המידע

const app = express();
app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://moriyash:mongodbmoriyash@projectfrontandback.danxveu.mongodb.net/?retryWrites=true&w=majority&appName=ProjectFrontAndBack', { //הנתיב של MONGODB
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});


const userSchema = new mongoose.Schema({//איך האובייקט נראה
   name: String,
   email: String,
   password: String
});

const User = mongoose.model('User', userSchema);


app.post('/api/users', async (req, res) => { //בקשות העברת מידע
    const { command, data } = req.body; //בהתאם לפקודה יש כמה אפשרויות

    try {
        switch (command) {
            case 'insert':
                const newUser = new User({ name: data.name, email: data.email, password: data.password});
                await newUser.save();
                return res.json({ message: 'User inserted successfully', user: newUser });

            case 'select':
                const users = await User.find({});
                return res.json({ message: 'Users fetched', users });

            case 'update':
                const updatedUser = await User.findByIdAndUpdate(
                    data.userId,
                    { email: data.newEmail },
                    { new: true }
                );
                if (!updatedUser) {
                    return res.status(404).json({ message: 'User not found' });
                }
                return res.json({ message: 'User updated', user: updatedUser });
            case 'delete':
                const deletedUser = await User.findByIdAndDelete(data.userId);
                if (!deletedUser) {
                   return res.status(404).json({ message: 'User not found' });
     }
                 return res.json({ message: 'User deleted' });

            case 'login':
                const user = await User.findOne({
                email: data.email,
                password: data.password,
    });
    if (user) {
        return res.json({ message: 'Login successful', user });
    } else {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

default:
    return res.status(400).json({ message: 'Unknown command' });

        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
