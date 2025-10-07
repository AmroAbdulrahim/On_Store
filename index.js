const express = require("express")

const app = express()
const mongoose = require('mongoose');
app.use(express.urlencoded({ extended: true}))
const path = require("path");
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")))
app.use("/js", express.static(path.join(__dirname, "node_modules/@popperjs/core/dist/umd")))
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "image")))
app.use(express.json())
const bcrypt = require("bcrypt")
// a way to image storage====================================================================
const multer = require('multer');

// إعداد المجلد اللي حتتحفظ فيه الصور
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'image'); // اسم المجلد
  },
  filename: function (req, file, cb) {
    // نحفظ الصورة باسمها الأصلي مع إضافة الوقت عشان ما تتكرر
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// رفع الصورة
// app.post('/', upload.single('image'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('مافي صورة مرفوعة');
//   }
  
//   res.send(`الصورة اتحفظت بنجاح في المجلد Image باسم: ${req.file.filename}`);
// });
//========================================================================================
const {Users, Mydata, Order} = require("./models/dataSchema")
// const Mydata = require("./models/dataSchema")
// const Users = require("./models/dataSchema")
// const PASSWORD = "1234"
// app.get("/add-item", (req, res) => {
//     res.send(`
//         <form method="POST" action="/add-item">
//             <input type="password" name="password" placeholder="أدخل كلمة السر" />
//             <button type="submit">دخول</button>
//         </form>
//     `);
// })
// app.post("/add-item", (req, res) => {
//     if (req.body.password === PASSWORD) {
//         res.sendFile(path.join(__dirname, "add-item.html"));
//     } else {
//         res.send("كلمة السر غلط!");
//     }
// });
app.get("/add-item=0000", (req, res) => {
    res.sendFile("./add-item.html", {root: __dirname})
})
app.get("/favorites", (req, res) => {
    res.sendFile("./favorites.html", {root: __dirname})
})
app.get("/home", (req, res) => {
    res.sendFile("./home.html", {root: __dirname})
})
app.get("/shopping-cart", (req, res) => {
    res.sendFile("./shopping-cart.html", {root: __dirname})
})
// استلام البيانات من الصفحة الأولى
app.post('/shopping-cart', (req, res) => {
    cartData = req.body;
    res.json({ message: 'تم استلام البيانات' });
})
// إرسال البيانات للصفحة الثانية
app.get('/orders', (req, res) => {
    res.sendFile("/orders.html", {root: __dirname})
})

app.post("/add-item", upload.single('image'), (req, res) => {
    console.log(req.body)
    console.log("FILE:",req.file)

    const mydata = new Mydata({
        image: req.file ? req.file.originalname : null,
        name: req.body.name,
        detalls: req.body.detalls,
        section: req.body.section,
        pric: req.body.pric
    })
    mydata.save().then(() => {
         res.redirect("/home")
    }).catch((err) => {
        console.log(err)
    })   
})

app.post("/home", (req, res) => {
    const { username, email, phoneNumber, address, password } = req.body
    console.log(req.body)

    bcrypt.hash(password, 10).then((hashedPassword) => {
        const user = new Users({
            username,
            email,
            phoneNumber,
            address,
            password: hashedPassword
        })
        return user.save()
    })
    .then(() => {


        res.redirect("/home")
    }).catch((err) => {
        console.log(err)
    })   
})

app.post("/login", (req, res) => {
  const { email, password } = req.body;

    Users.findOne({ email })
    .then(user => {
        if (!user) {
            return res.send("المستخدم غير موجود");
        }
        return bcrypt.compare(password, user.password)
        .then(isMatch => {
            if (!isMatch) {
                return res.send("كلمة المرور غير صحيحة");
            }
            res.send(`مرحباً يا ${user.username}`)
            console.log(user)
            
        })

    }).catch (err => {
        console.error(err);
        res.status(500).send("حدث خطأ في السيرفر");
    })
});

app.get("/data/:itemId", (req, res) => {
    const id = req.params.itemId
    
    Mydata.findById(id)
    .then((data) => {
        res.json(data)
    }).catch((err) => {
        console.log(res.status)
    })
})

app.get("/data", (req, res) => {
    Mydata.find().sort({_id: -1})
    .then((data) => {
        res.json(data)
    }).catch((err) => {
        console.log(res.status)
    })
})

app.get("/users", (req, res) => {
    Users.find()
    .then((data) => {
        res.json(data)
    }).catch((err) => {
        console.log(res.status)
    })
})

// راوت إرسال الطلب
app.post("/orders", function (req, res) {
    const { user, items, date } = req.body;
    console.log(req.body)

    if (!user || !items || items.length === 0) {
        return res.status(400).json({ error: "بيانات ناقصة" });
    }

    const newOrder = new Order({
        user: user,
        items: items,
        date: date
    });

    newOrder.save()
    .then(function () {
        res.status(201).json({ message: "تم حفظ الطلب بنجاح" });
    })
    .catch(function (err) {
        console.error(err);
        res.status(500).json({ error: "خطأ أثناء حفظ الطلب" });
    });
});

// راوت جلب الطلبات
app.get("/api/orders", function (req, res) {
    Order.find()
    .then(function (orders) {
        res.json(orders);
    })
    .catch(function (err) {
        res.status(500).json({ error: "خطأ في جلب الطلبات" });
    });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});


mongoose.connect("mongodb+srv://amro:b0H1dskVc710Ym3h@cluster0.w2pykip.mongodb.net/all-data?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    // app.listen(8000, () => {
    //     console.log("http://localhost:8000/home")
    // })
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });

}).catch((err) => {

});


// password
// """b0H1dskVc710Ym3h"""
