require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const multer = require("multer");
//
//
//
const Accounting = require("./models/accounting");
const Audit = require("./models/audit");
const Coformation = require("./models/coformation");
const Dsc = require("./models/dsc");
const Eway = require("./models/eway");
const Fssai = require("./models/fssai");
const Gst = require("./models/gst");
const Iec = require("./models/iec");
const Itr = require("./models/itr");
const Microatm = require("./models/microatm");
const Msme = require("./models/msme");
const Other = require("./models/other");
const Printingkit = require("./models/printingkit");
const Tax = require("./models/tax");
const Tds = require("./models/tds");
const Trademark = require("./models/trademark");
const Webservices = require("./models/webservices");

//
//
//
// Importing models
const Admin = require("./models/Admin");
const WhiteLabel = require("./models/Whitelabel");
const MasterDistributor = require("./models/Masterdistributor");
const Distributor = require("./models/Distributor");
const SubDistributor = require("./models/Subdistributor");
const Retailer = require("./models/Retailer");
//
//
//
app.use(bodyParser.json());
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/images", express.static("images"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/views", express.static(path.join(__dirname, "views")));
app.use(
  session({
    secret: "This is my secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.role = req.session.role;
  res.locals.userId = req.session.userId;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});
function ensureAuthenticated(req, res, next) {
  if (req.session.userId && req.session.role) {
    return next();
  }
  req.flash("error_msg", "Please log in to view that resource");
  res.redirect("/login");
}
//
//
//
// Middleware to check user roles
function isAdmin(req, res, next) {
  if (req.session.role === "admin") {
    return next();
  } else {
    res.status(403).send("Access denied. Admins only.");
  }
}
function isWhiteLabel(req, res, next) {
  if (req.session.role === "whitelabel") {
    return next();
  } else {
    res.status(403).send("Access denied. Distributors only.");
  }
}

function isMasterDistributor(req, res, next) {
  if (req.session.role === "masterdistributor") {
    return next();
  } else {
    res.status(403).send("Access denied. Distributors only.");
  }
}

function isDistributor(req, res, next) {
  if (req.session.role === "distributor") {
    return next();
  } else {
    res.status(403).send("Access denied. Distributors only.");
  }
}

function isSubDistributor(req, res, next) {
  if (req.session.role === "subdistributor") {
    return next();
  } else {
    res.status(403).send("Access denied. Sub Distributors only.");
  }
}

function isRetailer(req, res, next) {
  if (req.session.role === "retailer") {
    return next();
  } else {
    res.status(403).send("Access denied. Retailers only.");
  }
}

//
//
//

// Replace with your MongoDB Atlas connection string
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Session setup with MongoDB store
app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: dbUrl,
    }),
  })
);

//
//
//
// Initialize Razorpay instance
//
// Route to verify payment
//
//
//
//
//
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);
//
//
//
app.get("/home", async (req, res) => {
  res.render("home");
});
//
//
//
//
app.post("/editprice/:id/:redirect", ensureAuthenticated, async (req, res) => {
  const id = req.params.id;
  const redirect = req.params.redirect;
  const { uprice } = req.body;
  const updateprice = parseInt(uprice);
  await Accounting.findByIdAndUpdate(id, { price: updateprice }, { new: true });
  await Audit.findByIdAndUpdate(id, { price: updateprice }, { new: true });
  await Coformation.findByIdAndUpdate(
    id,
    { price: updateprice },
    { new: true }
  );
  await Dsc.findByIdAndUpdate(id, { price: updateprice }, { new: true });
  await Eway.findByIdAndUpdate(id, { price: updateprice }, { new: true });
  await Fssai.findByIdAndUpdate(id, { price: updateprice }, { new: true });
  await Gst.findByIdAndUpdate(id, { price: updateprice }, { new: true });
  await Iec.findByIdAndUpdate(id, { price: updateprice }, { new: true });
  await Itr.findByIdAndUpdate(id, { price: updateprice }, { new: true });
  await Microatm.findByIdAndUpdate(id, { price: updateprice }, { new: true });
  await Msme.findByIdAndUpdate(id, { price: updateprice }, { new: true });
  await Other.findByIdAndUpdate(id, { price: updateprice }, { new: true });
  await Printingkit.findByIdAndUpdate(
    id,
    { price: updateprice },
    { new: true }
  );
  await Tax.findByIdAndUpdate(id, { price: updateprice }, { new: true });
  await Tds.findByIdAndUpdate(id, { price: updateprice }, { new: true });
  await Trademark.findByIdAndUpdate(id, { price: updateprice }, { new: true });
  await Webservices.findByIdAndUpdate(
    id,
    { price: updateprice },
    { new: true }
  );
  res.redirect(`/${redirect}`);
});
//GST Services
app.get("/accounting", ensureAuthenticated, async (req, res) => {
  const accounting = await Accounting.find({});
  res.render("../views/services/accounting", { accounting });
});
app.get("/audit", ensureAuthenticated, async (req, res) => {
  const audit = await Audit.find({});
  res.render("../views/services/audit", { audit });
});
app.get("/coformation", ensureAuthenticated, async (req, res) => {
  const coformation = await Coformation.find({});
  res.render("../views/services/coformation", { coformation });
});
app.get("/dsc", ensureAuthenticated, async (req, res) => {
  const dsc = await Dsc.find({});
  res.render("../views/services/dsc", { dsc });
});
app.get("/eway", ensureAuthenticated, async (req, res) => {
  const eway = await Eway.find({});
  res.render("../views/services/eway", { eway });
});
app.get("/fssai", ensureAuthenticated, async (req, res) => {
  const fssai = await Fssai.find({});
  res.render("../views/services/fssai", { fssai });
});
app.get("/gst", ensureAuthenticated, async (req, res) => {
  const gst = await Gst.find({});
  res.render("../views/services/gst", { gst });
});
app.get("/iec", ensureAuthenticated, async (req, res) => {
  const iec = await Iec.find({});
  res.render("../views/services/iec", { iec });
});
app.get("/itr", ensureAuthenticated, async (req, res) => {
  const itr = await Itr.find({});
  res.render("../views/services/itr", { itr });
});
app.get("/microatm", ensureAuthenticated, async (req, res) => {
  const microatm = await Microatm.find({});
  res.render("../views/services/microatm", { microatm });
});
app.get("/msme", ensureAuthenticated, async (req, res) => {
  const msme = await Msme.find({});
  res.render("../views/services/msme", { msme });
});
app.get("/other", ensureAuthenticated, async (req, res) => {
  const other = await Other.find({});
  res.render("../views/services/other", { other });
});
app.get("/printingkit", ensureAuthenticated, async (req, res) => {
  const printingkit = await Printingkit.find({});
  res.render("../views/services/printingkit", { printingkit });
});
app.get("/tax", ensureAuthenticated, async (req, res) => {
  const tax = await Tax.find({});
  res.render("../views/services/tax", { tax });
});
app.get("/tds", ensureAuthenticated, async (req, res) => {
  const tds = await Tds.find({});
  res.render("../views/services/tds", { tds });
});
app.get("/trademark", ensureAuthenticated, async (req, res) => {
  const trademark = await Trademark.find({});
  res.render("../views/services/trademark", { trademark });
});
app.get("/webservices", ensureAuthenticated, async (req, res) => {
  const webservices = await Webservices.find({});
  res.render("../views/services/webservices", { webservices });
});

//marketing

app.get("/marketing", ensureAuthenticated, (req, res) => {
  res.render("../views/marketing/marketing");
});
app.get("/marketing/marketingdoc1", ensureAuthenticated, (req, res) => {
  res.render("../views/marketing/marketingdoc1");
});
app.get("/marketing/marketingdoc2", ensureAuthenticated, (req, res) => {
  res.render("../views/marketing/marketingdoc2");
});
app.get("/marketing/marketingdoc3", ensureAuthenticated, (req, res) => {
  res.render("../views/marketing/marketingdoc3");
});
app.get("/marketing/marketingdoc4", ensureAuthenticated, (req, res) => {
  res.render("../views/marketing/marketingdoc4");
});
app.get("/marketing/marketingdoc5", ensureAuthenticated, (req, res) => {
  res.render("../views/marketing/marketingdoc5");
});
app.get("/marketing/marketingdoc6", ensureAuthenticated, (req, res) => {
  res.render("../views/marketing/marketingdoc6");
});
app.get("/marketing/marketingdoc7", ensureAuthenticated, (req, res) => {
  res.render("../views/marketing/marketingdoc7");
});
app.get("/marketing/marketingdoc8", ensureAuthenticated, (req, res) => {
  res.render("../views/marketing/marketingdoc8");
});
app.get("/marketing/marketingdoc9", ensureAuthenticated, (req, res) => {
  res.render("../views/marketing/marketingdoc9");
});
app.get("/marketing/marketingdoc10", ensureAuthenticated, (req, res) => {
  res.render("../views/marketing/marketingdoc10");
});
app.get("/marketing/marketingdoc11", ensureAuthenticated, (req, res) => {
  res.render("../views/marketing/marketingdoc11");
});
//
//
//Grievance
//
//
app.get("/grievance", ensureAuthenticated, (req, res) => {
  res.render("../views/grievance/grievance");
});

//
//
//Cart
//
//
app.post("/cart/:price", ensureAuthenticated, async (req, res) => {
  const { name } = req.body;
  const price = req.params.price;
  const userId = req.session.user._id;
  const role = req.session.user.role;
  // Update the cart to have only the new product

  // Check if user exists
  switch (role) {
    case "admin":
      await Admin.findByIdAndUpdate(userId, {
        cart: { productName: name, price: price },
      });
      break;
    case "whitelabel":
      await WhiteLabel.findByIdAndUpdate(userId, {
        cart: { productName: name, price: price },
      });
      break;
    case "masterdistributor":
      await MasterDistributor.findByIdAndUpdate(userId, {
        cart: { productName: name, price: price },
      });
      break;
    case "distributor":
      await Distributor.findByIdAndUpdate(userId, {
        cart: { productName: name, price: price },
      });
      break;
    case "subdistributor":
      await SubDistributor.findByIdAndUpdate(userId, {
        cart: { productName: name, price: price },
      });
      break;
    case "retailer":
      await Retailer.findByIdAndUpdate(userId, {
        cart: { productName: name, price: price },
      });
      break;
  }

  req.flash("success_msg", "product added to your cart.");
  res.render("../views/cart", { price, name });
});
//
//
//
app.post("/payment/:total", ensureAuthenticated, async (req, res) => {
  const price = parseInt(req.params.total);

  // Admit 20%
  await Admin.findOneAndUpdate(
    { email: "sharathkr0402@gmail.com" },
    { $inc: { wallet: price * 0.2 } },
    { new: true }
  );
  if (req.session.user.role == "whitelabel") {
    await WhiteLabel.findOneAndUpdate(
      { email: req.session.user.email },
      { $inc: { wallet: price * 0.8 } },
      { new: true }
    );
  } else {
    if (req.session.user.masterDistributorId) {
      await MasterDistributor.findOneAndUpdate(
        { email: req.session.user.masterDistributorId },
        { $inc: { wallet: price * 0.1 } },
        { new: true }
      );
    } else {
      await Admin.findOneAndUpdate(
        { email: "sharathkr0402@gmail.com" },
        { $inc: { wallet: price * 0.1 } },
        { new: true }
      );
    }
    if (req.session.user.distributorId) {
      await Distributor.findOneAndUpdate(
        { email: req.session.user.distributorId },
        { $inc: { wallet: price * 0.1 } },
        { new: true }
      );
    } else {
      await Admin.findOneAndUpdate(
        { email: "sharathkr0402@gmail.com" },
        { $inc: { wallet: price * 0.1 } },
        { new: true }
      );
    }

    if (req.session.user.subDistributorId) {
      await SubDistributor.findOneAndUpdate(
        { email: req.session.user.subDistributorId },
        { $inc: { wallet: price * 0.1 } },
        { new: true }
      );
    } else {
      await Admin.findOneAndUpdate(
        { email: "sharathkr0402@gmail.com" },
        { $inc: { wallet: price * 0.1 } },
        { new: true }
      );
    }
  }
  res.redirect("/dashboard" + req.session.role);
});
//
//
//
//
//
//
//PDF downloader
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Certificate downloader
app.get("/certificateDownloader", async (req, res) => {
  try {
    // Load the existing PDF
    const pdfPath = path.join(__dirname, "Certificate.pdf");
    const existingPdfBytes = fs.readFileSync(pdfPath);

    // Load the PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    // Get the pages from the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Modify the content of the PDF
    const { height } = firstPage.getSize();
    firstPage.drawText(req.session.user.name, {
      x: 430,
      y: height - 225,
      size: 30,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();

    // Set headers and send PDF for download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Your_Certificate.pdf"
    );
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).send("Error replacing text in PDF");
  }
});
//
//
//letter head downloader
app.get("/letterHeadDownload", async (req, res) => {
  const mobile = req.session.user.mobile;
  const mobile1 = mobile.toString();
  try {
    // Load the existing PDF
    const pdfPath1 = path.join(__dirname, "Letterhead.pdf");
    const existingPdfBytes = fs.readFileSync(pdfPath1);

    // Load the PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Get the pages from the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Modify the content of the PDF
    const { height } = firstPage.getSize();

    if (req.session.user.address.length <= 35) {
      firstPage.drawText(req.session.user.address, {
        x: 340,
        y: height - 695,
        size: 10,
        color: rgb(0, 0, 0),
      });
    } else {
      firstPage.drawText(req.session.user.address.slice(0, 35) + "-", {
        x: 340,
        y: height - 690,
        size: 10,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText("-" + req.session.user.address.slice(35), {
        x: 340,
        y: height - 700,
        size: 10,
        color: rgb(0, 0, 0),
      });
    }
    // Modify the content of the PDF
    firstPage.drawText(mobile1, {
      x: 340,
      y: height - 718,
      size: 10,
      color: rgb(0, 0, 0),
    });

    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();

    // Set headers and send PDF for download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Your_Letter_Head.pdf"
    );
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).send("Error replacing text in PDF");
  }
});
//
//
//
//
//business Card downloader
app.get("/businessCardDownload", async (req, res) => {
  const mobile = req.session.user.mobile;
  const mobile1 = "+91 " + mobile.toString();
  try {
    // Load the existing PDF
    const pdfPath1 = path.join(__dirname, "Business_Card.pdf");
    const existingPdfBytes = fs.readFileSync(pdfPath1);

    // Load the PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Get the pages from the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { height } = firstPage.getSize();
    // Modify the content of the PDF
    if (req.session.user.address.length <= 42) {
      firstPage.drawText(req.session.user.address, {
        x: 110,
        y: height - 110,
        size: 6,
        color: rgb(1, 1, 1),
      });
    } else {
      firstPage.drawText(req.session.user.address.slice(0, 42) + "-", {
        x: 110,
        y: height - 107,
        size: 6,
        color: rgb(1, 1, 1),
      });
      firstPage.drawText("-" + req.session.user.address.slice(42), {
        x: 120,
        y: height - 115,
        size: 6,
        color: rgb(1, 1, 1),
      });
    }
    // Modify the content of the PDF
    firstPage.drawText(mobile1, {
      x: 165,
      y: height - 53,
      size: 6,
      color: rgb(0, 0, 0),
    });
    // Modify the content of the PDF
    firstPage.drawText(req.session.user.name, {
      x: 122,
      y: height - 20,
      size: 13,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    // Modify the content of the PDF
    let role1 = req.session.user.role;
    if (role1 == "user") {
      role1 = "Retailer";
    }
    if (role1 == "admin") {
      role1 = "Admin";
    }
    if (role1 == "whitelabel") {
      role1 = "WhiteLabel";
    }
    if (role1 == "distributor") {
      role1 = "Distributor";
    }
    if (role1 == "subdistributor") {
      role1 = "Subdistributor";
    }
    firstPage.drawText(role1, {
      x: 122,
      y: height - 30,
      size: 8,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();

    // Set headers and send PDF for download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Your_Business_Card.pdf"
    );
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).send("Error replacing text in PDF");
  }
});
//
//
//
//
//id Card downloader
app.get("/idCardDownload", async (req, res) => {
  try {
    const mobile = req.session.user.mobile;
    const mobile1 = "+91 " + mobile.toString();
    const expire0 = req.session.user.expire.toString();
    const date0 = req.session.user.date.toString();
    const expire1 = expire0.slice(0, 10);
    const date1 = date0.slice(0, 10);
    const src = req.session.user.image;

    // Load the JPEG image
    const image = await loadImage(src);

    // Define fixed canvas dimensions for the compressed image
    const fixedSize = 200; // Fixed width and height
    const canvas = createCanvas(fixedSize, fixedSize);
    const ctx = canvas.getContext("2d");

    // Compress the image to fit into the fixed canvas dimensions
    ctx.drawImage(image, 0, 0, fixedSize, fixedSize);

    // Convert the canvas to a Buffer
    const circularImageBuffer = canvas.toBuffer();

    // Load the existing PDF
    const pdfPath = path.join(__dirname, "ID_Card.pdf");
    const existingPdfBytes = fs.readFileSync(pdfPath);

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Get the first page
    const pages = pdfDoc.getPages();
    if (pages.length >= 2) {
      const firstPage = pages[0];
      const secondPage = pages[1];
      const { height } = firstPage.getSize();

      // Embed the circular image into the PDF
      const circularImage = await pdfDoc.embedPng(circularImageBuffer);

      // Fixed size for the image in the PDF
      const imageWidth = 60; // Fixed width
      const imageHeight = 70; // Fixed height

      // Draw the circular image onto the page
      firstPage.drawImage(circularImage, {
        x: 40,
        y: height - 115,
        width: imageWidth,
        height: imageHeight,
      });
      firstPage.drawText(mobile1, {
        x: 46,
        y: height - 158,
        size: 6,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(req.session.user.idNo, {
        x: 46,
        y: height - 137,
        size: 6,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      secondPage.drawText(expire1, {
        x: 60,
        y: 81.5,
        size: 6,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      secondPage.drawText(date1, {
        x: 60,
        y: 92.5,
        size: 6,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
    } else {
      throw new Error("PDF has less than 2 pages");
    }

    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();

    // Set headers and send the PDF for download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Your_ID_Card.pdf"
    );
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating the ID Card PDF");
  }
});
//
//
//
//About Contact and Term and Conditions
app.get("/about", (req, res) => {
  res.render("../views/about/about");
});
app.get("/contact", (req, res) => {
  res.render("../views/about/contact");
});
app.get("/privacy", (req, res) => {
  res.render("../views/about/privacy");
});
app.get("/refund", (req, res) => {
  res.render("../views/about/refund");
});
app.get("/terms", (req, res) => {
  res.render("../views/about/terms");
});
//
//
//
//Add new Service
app.get("/addservices/:model", ensureAuthenticated, (req, res) => {
  const model = req.params.model;
  const redirect = model.toLowerCase();
  res.render("../views/services/addservices", { model, redirect });
});
//
//
//
//Insert New Service
app.post("/insert/:model/:redirect", ensureAuthenticated, async (req, res) => {
  const model = req.params.model;
  const redirect = req.params.redirect;
  const service = {
    name: req.body.name,
    quantity: req.body.quantity,
    documents: JSON.parse(req.body.documents),
    price: req.body.price,
  };

  switch (model) {
    case "Accounting":
      await Accounting.insertMany(service);
      break;
    case "Audit":
      await Audit.insertMany(service);
      break;
    case "Coformation":
      await Coformation.insertMany(service);
      break;
    case "Dsc":
      await Dsc.insertMany(service);
      break;
    case "Eway":
      await Eway.insertMany(service);
      break;
    case "Fssai":
      await Fssai.insertMany(service);
      break;
    case "Gst":
      await Gst.insertMany(service);
      break;
    case "Iec":
      await Iec.insertMany(service);
      break;
    case "Itr":
      await Itr.insertMany(service);
      break;
    case "Microatm":
      await Microatm.insertMany(service);
      break;
    case "Msme":
      await Msme.insertMany(service);
      break;
    case "Other":
      await Other.insertMany(service);
      break;
    case "Printingkit":
      await Printingkit.insertMany(service);
      break;
    case "Tax":
      await Tax.insertMany(service);
      break;
    case "Trademark":
      await Trademark.insertMany(service);
      break;
    case "Webservices":
      await Webservices.insertMany(service);
      break;
    case "Tds":
      await Tds.insertMany(service);
      break;
  }
  res.redirect(`/${redirect}`);
});
//
//
//
//Delete the Service
app.post("/delete/:id/:redirect", ensureAuthenticated, async (req, res) => {
  const id = req.params.id;
  const redirect = req.params.redirect;

  await Accounting.findByIdAndDelete(id, { new: true });
  await Audit.findByIdAndDelete(id, { new: true });
  await Coformation.findByIdAndDelete(id, { new: true });
  await Dsc.findByIdAndDelete(id, { new: true });
  await Eway.findByIdAndDelete(id, { new: true });
  await Fssai.findByIdAndDelete(id, { new: true });
  await Gst.findByIdAndDelete(id, { new: true });
  await Iec.findByIdAndDelete(id, { new: true });
  await Itr.findByIdAndDelete(id, { new: true });
  await Microatm.findByIdAndDelete(id, { new: true });
  await Msme.findByIdAndDelete(id, { new: true });
  await Other.findByIdAndDelete(id, { new: true });
  await Printingkit.findByIdAndDelete(id, { new: true });
  await Tax.findByIdAndDelete(id, { new: true });
  await Tds.findByIdAndDelete(id, { new: true });
  await Trademark.findByIdAndDelete(id, { new: true });
  await Webservices.findByIdAndDelete(id, { new: true });

  res.redirect(`/${redirect}`);
});
//
//
//
//Add images to Carousel

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "gst-services", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });
//
//
//
//
const imageSchema = new mongoose.Schema({
  url: String,
});
const Image = mongoose.model("Image", imageSchema);

app.post("/upload", upload.single("image"), async (req, res) => {
  const newImage = new Image({ url: req.file.path }); // Cloudinary provides 'path' as URL
  await newImage.save();
  res.redirect("/dashboardadmin");
});

app.post("/delete/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image || !image.url) {
      console.log("Image not found or URL is missing.");
      req.flash("error_msg", "Image not found.");
      return res.redirect("/dashboardadmin");
    }

    const publicId = image.url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    // Use `deleteOne` to remove the document from the database
    await Image.deleteOne({ _id: req.params.id });

    req.flash("success_msg", "Image deleted successfully.");
  } catch (error) {
    console.error("Error deleting image:", error);
    req.flash("error_msg", "Error deleting image. Please try again.");
  }

  res.redirect("/dashboardadmin");
});

//
//
//
//
// Admin-specific route
app.get("/dashboardadmin", ensureAuthenticated, isAdmin, async (req, res) => {
  const images = await Image.find();
  res.render("../views/dashboard/admin", { user: req.session.user, images });
});
// Admin-specific route
app.get(
  "/dashboardwhitelabel",
  ensureAuthenticated,
  isWhiteLabel,
  async (req, res) => {
    const images = await Image.find();
    res.render("../views/dashboard/whitelabel", {
      user: req.session.user,
      images,
    });
  }
);
// Master Distributor-specific route
app.get(
  "/dashboardmasterdistributor",
  ensureAuthenticated,
  isMasterDistributor,
  async (req, res) => {
    const images = await Image.find();
    res.render("../views/dashboard/masterdistributor", {
      user: req.session.user,
      images,
    });
  }
);
// Distributor-specific route
app.get(
  "/dashboarddistributor",
  ensureAuthenticated,
  isDistributor,
  async (req, res) => {
    const images = await Image.find();
    res.render("../views/dashboard/distributor", {
      user: req.session.user,
      images,
    });
  }
);

// SubDistributor-specific route
app.get(
  "/dashboardsubdistributor",
  ensureAuthenticated,
  isSubDistributor,
  async (req, res) => {
    const images = await Image.find();
    res.render("../views/dashboard/subdistributor", {
      user: req.session.user,
      images,
    });
  }
);
//
//
//
// Retailer-specific route
app.get(
  "/dashboardretailer",
  ensureAuthenticated,
  isRetailer,
  async (req, res) => {
    const images = await Image.find();
    res.render("../views/dashboard/retailer", {
      user: req.session.user,
      images,
    });
  }
);
//
//
//
//
app.get("/", async (req, res) => {
  const images = await Image.find();
  res.render("../views/dashboard/nologin", { images });
});
//
//
//
//
//
app.listen(3000, () => {
  console.log("listening on port 3000");
});
