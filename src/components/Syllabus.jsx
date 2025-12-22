import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // In your component:
import { createPortal } from "react-dom";

/* ======= FULL embedded syllabus tree (auto-parsed + Aptitude fixed) ======= */
const TREE = {
  "Episode 1 - Code": {
    "1. How the Internet Works:": [
      {
        title: "History of Web (Web 1.0 to Web 3.0).",
        done: false,

        completedOn: "",
      },
      {
        title: "How computer communicate with each other.",
        done: false,

        completedOn: "",
      },
      {
        title: "How computer send data all over the world.",
        done: false,

        completedOn: "",
      },
      {
        title: "What is Domain Name, IP & MAC Addresses and Routing.",
        done: false,

        completedOn: "",
      },
      {
        title: "How ISP and DNS work together to deliver data.",
        done: false,

        completedOn: "",
      },
    ],
    "2. Client-Server Architecture:": [
      {
        title: "What is Client-Server Model.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Difference between Client (browser) and Server (the computer hosting your website).",
        done: false,

        completedOn: "",
      },
      {
        title:
          "How HTTP request and response cycle works (how browser talk to server).",
        done: false,

        completedOn: "",
      },
      {
        title: "What happens when you visit a website.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Difference between Front-end and Back-end (Front-end vs Back-end).",
        done: false,

        completedOn: "",
      },
      {
        title: "What are Static Websites and Dynamic Websites.",
        done: false,

        completedOn: "",
      },
      {
        title: "What is web hosting and how it works.",
        done: false,

        completedOn: "",
      },
    ],
    "3. Internet Protocols:": [
      {
        title: "What is TCP protocol and why is widely used",
        done: false,

        completedOn: "",
      },
      {
        title: "How Connection is established using TCP (3 Way handshake)",
        done: false,

        completedOn: "",
      },
      {
        title: "What is UDP and why its used for fast communication",
        done: false,

        completedOn: "",
      },
      {
        title: "How UPD establishes connection",
        done: false,

        completedOn: "",
      },
      {
        title: "Difference between TCP and UPD",
        done: false,

        completedOn: "",
      },
    ],
    "4. Understanding HTTP and HTTPS": [
      {
        title: "What is HTTP and its different version",
        done: false,

        completedOn: "",
      },
      {
        title: "HTTP status code for responses",
        done: false,

        completedOn: "",
      },
      {
        title: "What is HTTPS and why its better than HTTP",
        done: false,

        completedOn: "",
      },
      {
        title: "How HTTPS provides a secure connection",
        done: false,

        completedOn: "",
      },
      {
        title: "What is SSL/TLS Encryption",
        done: false,

        completedOn: "",
      },
      {
        title: "What are Proxy and Reverse Proxy",
        done: false,

        completedOn: "",
      },
      {
        title: "How VPN works and helps accessing restricted content",
        done: false,

        completedOn: "",
      },
    ],
    "5. Preparing Your Machine": [
      {
        title: "Installing & Setting up VS Code",
        done: false,

        completedOn: "",
      },
      {
        title: "Installing helpful extensions",
        done: false,

        completedOn: "",
      },
      {
        title: "Setting up your browser for development",
        done: false,

        completedOn: "",
      },
      {
        title: "What are file and folders and how to create them",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Testing our environment via serving a webpage - “ Namaste Duniya ”",
        done: false,

        completedOn: "",
      },
    ],
  },
  "Episode 2 - Stage": {
    "1. Starting with HTML": [
      {
        title: "Understanding HTML and its use Cases.",
        done: false,
        completedOn: "",
      },
      {
        title: "Creating first HTML page in VS Code",
        done: false,
        completedOn: "",
      },
      {
        title: "Understand HTML Structure",
        done: false,
        completedOn: "",
      },
      {
        title:
          "Understanding Tags and building simple HTML page - doctype , html , head , title , body",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Working with text elements - h tags , p tag , br tag , a tag , span , code , pre",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Working with HTML Lists(Ordered & Unordered lists) - ol , ul , li",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding Concept of nested elements in HTML",
        done: false,

        completedOn: "",
      },
      {
        title: "Working with Media Tags - img , video , audio",
        done: false,

        completedOn: "",
      },
      {
        title: "HTML attributes - href , target , alt , src , width , height ,",
        done: false,

        completedOn: "",
      },
      {
        title: "Navigating between pages",
        done: false,

        completedOn: "",
      },
    ],
    "2. More on HTML": [
      {
        title:
          "Understanding semantic tags - article , section , main , aside , form , footer , header , details , figure",
        done: false,

        completedOn: "",
      },
      {
        title: "Differentiating between block and inline elements",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Text formatting tags in HTML - b , string , i , small , ins , sub , sup , del , mark",
        done: false,

        completedOn: "",
      },
      {
        title: "Working with HTML tables - table , td , tr , th",
        done: false,

        completedOn: "",
      },
    ],
    "3. HTML Forms and Inputs": [
      {
        title: "What is Form and why its important",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Creating a simple Form with tags - form , input , textarea , select , button , label",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Types of input fields - checkbox , text , color , file , tel , date , number , radio , submit , range",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Attributes of Form Elements - method , actions , target , novalidate , enctype , name , required, placeholder",
        done: false,

        completedOn: "",
      },
    ],
    "4. Media Tags in HTML": [
      {
        title: "Understanding with audio and video Tags",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Attributes if media tags - src , width , height , alt , muted , loop , autoplay , controls , media",
        done: false,

        completedOn: "",
      },
      {
        title: "Using source element for alternative media files",
        done: false,

        completedOn: "",
      },
    ],
    "5. Basics of CSS": [
      {
        title: "Introduction to CSS and Why it is important",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding Syntax, Selectors and comments in CSS",
        done: false,

        completedOn: "",
      },
      {
        title: "Adding CSS to HTML Page - Inline , Internal , External",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Understanding difference between selectors - class , id , element",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding precedence of selectors",
        done: false,

        completedOn: "",
      },
      {
        title:
          "How to style text using CSS - font family , font style , font weight , line-height , text-decoration , text-align , text-transform , letter-spacing , word-spacing , text-shadow",
        done: false,

        completedOn: "",
      },
    ],
    "6. Styling With CSS": [
      {
        title: "Working with colors in CSS - name , rgb , etc.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Working with css units - % , px , rem , em , vw , vh , min , max",
        done: false,

        completedOn: "",
      },
      {
        title: "Working with borders and border styling",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Working with box properties - margin , padding , box-sizing , height , width",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Understanding Background properties - background-size , background-attachment , background-image , background-repeat , background-position , linear-gradient",
        done: false,

        completedOn: "",
      },
      {
        title: "Implementing shadow-[0_0_20px_rgba(0,0,0,0.2)] property.",
        done: false,

        completedOn: "",
      },
    ],
    "7. More about CSS": [
      {
        title:
          "Applying display properties - inline , grid , flex , none , inline-block , etc.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Introduction to FlexBox for aligning and structure - flex-direction , order , flex-wrap , flex-grow , flex-shrink , justify-content , align-items , align-content , align-self , flex-basis , shorthand properties of flex",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding Flex Grid for making grids using CSS.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Working with positional properties - absolute , relative , static , sticky , fixed .",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding Overflow - visible , hidden , scroll.",
        done: false,

        completedOn: "",
      },
      {
        title: "Working with Grouping Selectors.",
        done: false,

        completedOn: "",
      },
      {
        title: "Why we use Nested Selectors.",
        done: false,

        completedOn: "",
      },
    ],
    "8. Interesting things about CSS ✌️": [
      {
        title:
          "Applying pseudo classes and Pseudo Elements [ hover , focus , after , before , active ] .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Learning CSS Transitions ( properties , duration , timing functions , delays ).",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Creating with Transform ( translate , rotate , scale , skew , transform , rotate ).",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Working with 3D Transform ( translate3d() , translateZ() , scale3d() , scaleZ() , rotate3d() , rotateZ() .",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding CSS Animation ( @keyframes ).",
        done: false,

        completedOn: "",
      },
    ],
    "9. Responsive with CSS 🖥️": [
      {
        title:
          "Difference Between Mobile-first and Desktop first Website(mobile-first vs desktop first).",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Measurement units for Responsive Design - px(pixel) , in(inch), mm(millimetre) , % , rem",
        done: false,

        completedOn: "",
      },
      {
        title: "Using Viewport meta element for Responsive.",
        done: false,

        completedOn: "",
      },
      {
        title: "Setting up Images and Typography for Responsiveness.",
        done: false,

        completedOn: "",
      },
      {
        title: "What are Media queries [ @media , max-width , min-width ].",
        done: false,

        completedOn: "",
      },
      {
        title: "Using Different function of CSS [ clamp , max , min ].",
        done: false,

        completedOn: "",
      },
      {
        title: "Understand HTML structure for Responsive Design.",
        done: false,

        completedOn: "",
      },
    ],
    "10 Working With SASS (SASSY) my favorite 🤩": [
      {
        title:
          "What is SASS? Variables , Nesting , Mixins , Functions and Operators .",
        done: false,

        completedOn: "",
      },
      {
        title: "Setting up environment for SCSS .",
        done: false,

        completedOn: "",
      },
      {
        title: "SCSS or SASS? and Setting Up SCSS .",
        done: false,

        completedOn: "",
      },
    ],
    "11. Basics of Javascript with ES6+ Features 🚀": [
      {
        title:
          "Introduction to JavaScript, Why it is Important! and What can it do for you?",
        done: false,

        completedOn: "",
      },
      {
        title: "How to link javascript files using script-tag .",
        done: false,

        completedOn: "",
      },
      {
        title: "Running JavaScript in the Browser Console .",
        done: false,

        completedOn: "",
      },
      {
        title: "Variables and Keywords in Javascript [ var , let , const ].",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Logging with javascript - [ console.log() , console.info() , console.warn() , prompt , alert ]",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Working with String in JS and there -[ splice , slice , template string , split , replace , includes ]",
        done: false,

        completedOn: "",
      },
      {
        title: "What are Statement and Semicolons in JS",
        done: false,

        completedOn: "",
      },
      {
        title: "How to add Comments in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title:
          "What are Expression in Js and difference between expression and statement",
        done: false,

        completedOn: "",
      },
      {
        title:
          "JavaScript Data Types - [ float , number , string , boolean , null , array , object , Symbol , Undefined ]",
        done: false,

        completedOn: "",
      },
      {
        title: "Some Important Values - [ undefined , null , NaN , Infinity ]",
        done: false,

        completedOn: "",
      },
      {
        title: "Relative and Primitive Data Type in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Basic Operators(Arithmetic, Assignment, Increment, Decrement, Comparison, Logical, Bitwise) - [ + , , , / , ++ , - , == , === , != , and more ]",
        done: false,

        completedOn: "",
      },
      {
        title: "Variable hoisting in JavaScript",
        done: false,

        completedOn: "",
      },
    ],
    "12 . Loops and Conditionals in Javascript": [
      {
        title:
          "Understanding Condition Operator in Javascript - [ if , else , if-else , else-if , Ternary Operator , switch ]",
        done: false,

        completedOn: "",
      },
      {
        title: "for Loop in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title: "while Loop in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title: "do...while in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title: "forEach in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title: "for in Loop in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title: "for of Loop in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title: "Recursion in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title: "Loop control statements - [ break , continue ]",
        done: false,

        completedOn: "",
      },
    ],
    "13. Functions in JavaScript": [
      {
        title:
          "Understanding Function in JavaScript and why its widely used - [ parameters , arguments , rest parameters , hoisting , Variable Hoisting , Function Hoisting ]",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Parameters in JavaScript - [ required , destructured , rest , default ]",
        done: false,

        completedOn: "",
      },
      {
        title: "Arguments in JavaScript - [ positional , default , spread ]",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Classic Function , Nested Function (function within function), Scope Chain in Javascript.",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding Immediately Invoked Function Expression(IIFE).",
        done: false,

        completedOn: "",
      },
      {
        title:
          "More Functions in JavaScript - [ Arrow Function , Fat Arrow , Anonymous , Higher Order , Callback , First Class , Pure Function , Impure Function ]",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Understanding Scoping in JS - [ Global scope , Function scope ]",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding Closures , Scoping Rule .",
        done: false,

        completedOn: "",
      },
    ],
    "14. Arrays and Objects in JavaScript": [
      {
        title: "What are Arrays in JavaScript and how to Create an Array.",
        done: false,

        completedOn: "",
      },
      {
        title: "Understand How to Accessing Elements in Array.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Functions on Arrays - [ push , pop , shift , unshift , indexOf , array destructuring , filter , some , map , reduce , spread operator , slice , reverse , sort , join , toString ]",
        done: false,

        completedOn: "",
      },
      {
        title: "Iterating Over Arrays using - [ For Loop , forEach ]",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Understanding What are Objects in JavaScript - [ key-value pair ]",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Creating Objects, Accessing Properties, Deleting Property and Nested Objects.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Recognise How Objects Are Stored, Traverse Keys of an Object, Array as Object.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Timing Events - setTimeout() , setInterval() , clearTimeout() , clearInterval()",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Operation in Objects - [ freeze , seal , destructuring , object methods , this keyword ]",
        done: false,

        completedOn: "",
      },
    ],
    "15. Document Object Model Manipulation": [
      {
        title: "Introduction to DOM in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Understanding DOM Structure and Tree - [ nodes , elements , document ]",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Fetching Elements in DOM - [ document.getElementById , document.getElementsByTagName , document.getElementsByClassName, document.querySelectorAll , document.querySelector ]",
        done: false,

        completedOn: "",
      },
      {
        title:
          "DOM Tree Traversal - [ parentNode , childNodes , firstChild , nextSibling ]",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Manipulating DOM Element in JavaScript - [ innerHTML , textContent , setAttribute , getAttribute , style property , classList ]",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Create and Removing DOM Elements - [ createElement() , appendChild() , insertBefore() , removeChild() ]",
        done: false,

        completedOn: "",
      },
    ],
    "16. Event Handeling in JavaScript": [
      {
        title:
          "Event Handling in JavaScript - [ addEventListner() , event bubbling , event.target ]",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Understanding Scroll Events, Mouse Events, Key Events and Strict Mode.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Working with Forms and Input Elements [ Accessing Form Data , Validating Forms , preventDefault() , onsubmit , onchange ]",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Working with Classes ****Adding, Removing , Toggling (classList methods)",
        done: false,

        completedOn: "",
      },
      {
        title: "Browser Events - [ DOMContentLoaded , load , resize , scroll ]",
        done: false,

        completedOn: "",
      },
    ],
    "17. Using Browser Functionalities in JavaScript": [
      {
        title:
          "Browser Object Model - [ window , navigator , history , location , document ]",
        done: false,

        completedOn: "",
      },
      {
        title: "Window Object - [ window.location , window.history ]",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Working with Storage - [ Local Storage , Session Storage , Cookies ]",
        done: false,

        completedOn: "",
      },
      {
        title: "Web APIs in DOM - [ Fetch API ]",
        done: false,

        completedOn: "",
      },
    ],
    "18. Object Oriented Concepts in JavaScripts": [
      {
        title: "Introduction to OOPS in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding classes and objects in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Understanding Constructor and Prototypes - [ this keyword , call , apply , bind ]",
        done: false,

        completedOn: "",
      },
      {
        title:
          "More Topics in OOPS - [ class expression , hoisting , inheritence , getter & setter ]",
        done: false,

        completedOn: "",
      },
    ],
    "19.AsynchronousProgramming JavaScript": [
      {
        title: "Introduction to Asynchrony in JavaScript.",
        done: false,

        completedOn: "",
      },
      {
        title: "Introduction to callbacks and Problems in Callbacks",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding promises - pending , resolved , rejected",
        done: false,

        completedOn: "",
      },
      {
        title: "How to prevent callback hell using async & await .",
        done: false,

        completedOn: "",
      },
      {
        title: "setInterval & setTimeout in JavaScript",
        done: false,

        completedOn: "",
      },
    ],
    "20. Error Handling in JavaScript": [
      {
        title: "Introduction to Error Handling",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Common types of errors in JavaScript - [ Syntax errors , Runtime errors , Logical errors ]",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding the Error object - [ message , name , stack ]",
        done: false,

        completedOn: "",
      },
      {
        title: "Handling exceptions using try-catch , try-catch-finally",
        done: false,

        completedOn: "",
      },
      {
        title: "How to Throw Errors in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title: "How to create custom error in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title: "Error Handling in Asynchronous Code",
        done: false,

        completedOn: "",
      },
    ],
    "21. Kuch Baatein Advance JavaScript Pr ⚙️": [
      {
        title: "Throttling and Debouncing uses in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title:
          "JSON Handeling and JavaScript - [ JSON.parse() , JSON.stringify() ]",
        done: false,

        completedOn: "",
      },
    ],
    "22. Git and Github": [
      {
        title: "What is Git and Github?",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Concepts - Git commits , Understanding branches , Making branches , merging branches , conflict in branches , understanding workflow , pushing to GitHub .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "How to use GitHub with team members, forking, PR(pull requests) open source contribution, workflow with large teams.",
        done: false,

        completedOn: "",
      },
    ],
  },
  "Episode 3 - Commit": {
    "1. Introduction of React 🪫": [
      {
        title: "What is React, and Why Use It?",
        done: false,

        completedOn: "",
      },
      {
        title:
          "What are Components and types of Components - class component , function components",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Understanding Single Page Applications (SPAs), Single Page Applications Vs Multi-Page Applications.",
        done: false,

        completedOn: "",
      },
      {
        title: "Difference between Real DOM and Virtual DOM",
        done: false,

        completedOn: "",
      },
      {
        title: "NPM Basics | Installing Packages .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "How does updates work in React? and More ES6+ features like Import & Exports ,",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Difference Between React and Other Frameworks ( Angular , Vue ).",
        done: false,

        completedOn: "",
      },
      {
        title: "Learning Some Basic Terminal Commands - pwd , ls , cd , clear",
        done: false,

        completedOn: "",
      },
      {
        title: "Setting Up React Environment with nodejs .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Install React-Vite Boilerplate and Installing React Developer Tools.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Understanding JSX or JavaScript XML and Its Importance - Fragments , Components Naming .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Creating and Understanding best practices for Components in React.",
        done: false,

        completedOn: "",
      },
    ],
    "2. Styling in React 🐼": [
      {
        title: "Different Styling Approaches.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Importance of component-based styling. Inline Styles , CSS Modules",
        done: false,

        completedOn: "",
      },
      {
        title: "Dynamic Styling Based on Props or State.",
        done: false,

        completedOn: "",
      },
      {
        title: "Responsive Design in React",
        done: false,

        completedOn: "",
      },
      {
        title: "Media queries with CSS and styled-components.",
        done: false,

        completedOn: "",
      },
    ],
    "3. Animations 🔥": [
      {
        title:
          "Animation and Transitions Using libraries like framer-motion or gsap for advanced animations.",
        done: false,

        completedOn: "",
      },
    ],
    "3. React Basics 🔦": [
      {
        title: "Create Components with functions .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Importing css file/stylesheet in react and Adding a CSS Modules Stylesheet - Styled Components , Dynamic styling with styled-components .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Creating a state and Manage State using setState - What is State? , setState , useState .",
        done: false,

        completedOn: "",
      },
      {
        title: "Creating Parameterised Function Components in React.",
        done: false,

        completedOn: "",
      },
      {
        title: "React Props : Passing Data to Components.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Function chaining in React and Conditional Rendering - Rendering Array Data via map , Eliminating Array Data via filter .",
        done: false,

        completedOn: "",
      },
    ],
    "4. More on React 📽️": [
      {
        title: "Higher Order Components in React.",
        done: false,

        completedOn: "",
      },
      {
        title: "Reusing Components, Lists and Keys in React.",
        done: false,

        completedOn: "",
      },
      {
        title: "Sharing Data with child components : Props Drilling .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Rendering a List, Mapping and Component Lifecycle - Mounting , Updating , Unmounting .",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding React Component Lifecycle .",
        done: false,

        completedOn: "",
      },
      {
        title: "Different Lifecycle Methods like componentDidMount .",
        done: false,

        completedOn: "",
      },
    ],
    "5. Useful Hooks in React 🪝": [
      {
        title: "Understanding React Hooks",
        done: false,

        completedOn: "",
      },
      {
        title: "Rules of hooks.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Commonly Used Hooks: useState useEffect useContext useRef useCallback useMemo",
        done: false,

        completedOn: "",
      },
      {
        title: "useState",
        done: false,

        completedOn: "",
      },
      {
        title: "useEffect",
        done: false,

        completedOn: "",
      },
      {
        title: "useContext",
        done: false,

        completedOn: "",
      },
      {
        title: "useRef",
        done: false,

        completedOn: "",
      },
      {
        title: "useCallback",
        done: false,

        completedOn: "",
      },
      {
        title: "useMemo",
        done: false,

        completedOn: "",
      },
      {
        title: "Custom Hooks : When and How to Create Them",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding and Applying Context API .",
        done: false,

        completedOn: "",
      },
    ],
    "6. Navigation in the React withReact Router 🚧": [
      {
        title: "Introduction to React Router.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Setting Up and Configuring React Router setup of react-router-dom .",
        done: false,

        completedOn: "",
      },
      {
        title: "Navigating Between Pages with .",
        done: false,

        completedOn: "",
      },
      {
        title: "Passing Data while Navigating",
        done: false,

        completedOn: "",
      },
      {
        title: "Dynamic Routing",
        done: false,

        completedOn: "",
      },
      {
        title: "URL Parameters and Query Strings",
        done: false,

        completedOn: "",
      },
      {
        title: "Nested Routes",
        done: false,

        completedOn: "",
      },
      {
        title: "Programmatic Navigation Using useNavigate .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Handling 404 Pages : fallback route for unmatched paths, Customizing the “Page Not Found” experience.",
        done: false,

        completedOn: "",
      },
    ],
    "7. State Management Using Redux. 🏪": [
      {
        title:
          "Introduction to Redux , What is redux?, When and Why use redux?",
        done: false,

        completedOn: "",
      },
      {
        title: "Understand Principles of Redux and Redux Flow.",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding State Management in React using Redux.",
        done: false,

        completedOn: "",
      },
      {
        title: "Why Use State Management Libraries?",
        done: false,

        completedOn: "",
      },
      {
        title: "Why Redux need reducers to be pure functions .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Redux Basics: Actions , Reducers , Store , Currying , Middleware , Async Actions: Thunk",
        done: false,

        completedOn: "",
      },
      {
        title: "Connecting Redux to React Components with react-redux .",
        done: false,

        completedOn: "",
      },
      {
        title: "Introduction to Redux Toolkit.",
        done: false,

        completedOn: "",
      },
      {
        title: "Alternatives: Recoil, Zustand, or MobX.",
        done: false,

        completedOn: "",
      },
    ],
    "8. Form controls in the React : Building Dynamic Forms 📋": [
      {
        title: "Introduction to Forms in React.",
        done: false,

        completedOn: "",
      },
      {
        title: "Building Basic Forms.",
        done: false,

        completedOn: "",
      },
      {
        title: "Creating form elements like input , textarea , select , etc.",
        done: false,

        completedOn: "",
      },
      {
        title: "Two way binding with react [ input , textarea ].",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Handling Form Events [ onChange , onSubmit , event.preventDefault() ].",
        done: false,

        completedOn: "",
      },
      {
        title: "Validation in React Forms : client-side form validation.",
        done: false,

        completedOn: "",
      },
      {
        title: "Integrating Forms with APIs.",
        done: false,

        completedOn: "",
      },
      {
        title: "Sending form data to a backend using fetch or axios .",
        done: false,

        completedOn: "",
      },
      {
        title: "Handling loading states and success/error feedback.",
        done: false,

        completedOn: "",
      },
    ],
    "9. Performance Optimization 🏎️": [
      {
        title: "Code Splitting with React Lazy and Suspense",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Avoids redundant calculations by caching Using Memoization Techniques: React.memo useMemo useCallback",
        done: false,

        completedOn: "",
      },
      {
        title: "React.memo",
        done: false,

        completedOn: "",
      },
      {
        title: "useMemo",
        done: false,

        completedOn: "",
      },
      {
        title: "useCallback",
        done: false,

        completedOn: "",
      },
      {
        title: "Avoiding Re-Renders using useState ,",
        done: false,

        completedOn: "",
      },
      {
        title: "Optimizing Component Structure",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Performance Profiling Tools using Chrome DevTools , Lighthouse , Web Vitals ,Largest Contentful Paint (LCP), First Input Delay (FID)",
        done: false,

        completedOn: "",
      },
    ],
    "10. Deploying React projects 🚨": [
      {
        title: "Preparing a React App for Production .",
        done: false,

        completedOn: "",
      },
      {
        title: "Building React Applications.",
        done: false,

        completedOn: "",
      },
      {
        title: "Environment Variables in React.",
        done: false,

        completedOn: "",
      },
      {
        title: "Deployment Platforms: Netlify , Vercel , GitHub Pages ,",
        done: false,

        completedOn: "",
      },
    ],
    "11. Real-World Project with React 👷🏻‍♂️": [
      {
        title: "Building a Complete React Project",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Combining All Concepts ( Routing , State Management , API , etc.)",
        done: false,

        completedOn: "",
      },
      {
        title: "Styling and Responsiveness ,",
        done: false,

        completedOn: "",
      },
      {
        title: "Optimizing and Deploying the Project.",
        done: false,

        completedOn: "",
      },
    ],
    "12. Basic SEO Principles": [
      {
        title: "On-Page Optimization in SEO.",
        done: false,

        completedOn: "",
      },
      {
        title: "Guide to SEO Meta Tags.",
        done: false,

        completedOn: "",
      },
      {
        title: "Image SEO Best Practices.",
        done: false,

        completedOn: "",
      },
      {
        title: "Internal Link Building SEO.",
        done: false,

        completedOn: "",
      },
      {
        title: "Create An SEO Sitemap For a Website.",
        done: false,

        completedOn: "",
      },
    ],
    "13. Three.js and React Three-Fiber": [
      {
        title: "Understanding what is Scene .",
        done: false,

        completedOn: "",
      },
      {
        title: "Using 3d models for animation.",
        done: false,

        completedOn: "",
      },
      {
        title: "Controlling view with Orbit controls.",
        done: false,

        completedOn: "",
      },
      {
        title: "Applying Lights inside the scene.",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding different types of Cameras .",
        done: false,

        completedOn: "",
      },
      {
        title: "Animating the mesh with GSAP or Framer motion .",
        done: false,

        completedOn: "",
      },
      {
        title: "Different types Geometries .",
        done: false,

        completedOn: "",
      },
      {
        title: "Using different Materials for animation.",
        done: false,

        completedOn: "",
      },
    ],
  },
  "Episode 4 - Push": {
    "1. Starting with Node.js - The Beginning 🏁": [
      {
        title:
          "Introduction to Node.js and Getting Our Tools - Node.js LTS , Postman , Editor",
        done: false,

        completedOn: "",
      },
      {
        title: "Setting up the Tools for our Environments",
        done: false,

        completedOn: "",
      },
      {
        title: "Running script with nodejs - “Namaste Duniya”",
        done: false,

        completedOn: "",
      },
      {
        title: "NPM Basics | Installing Packages .",
        done: false,

        completedOn: "",
      },
      {
        title: "Creating and Managing package.json .",
        done: false,

        completedOn: "",
      },
    ],
    "2. Creating Server - Writing Our First Server 📱": [
      {
        title: "What is Server and how it works?",
        done: false,

        completedOn: "",
      },
      {
        title: "Setting Up Our First Node.js Server using HTTP",
        done: false,

        completedOn: "",
      },
      {
        title: "Serving A Response to the Browser and Understanding Responses.",
        done: false,

        completedOn: "",
      },
      {
        title: "Routing in HTTP Servers.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Understanding Status Code - 1XX , 2XX , 3XX , 404 - Not Found , 200 - success , 500 - Internal Server error , 422 - Invalid Input , 403 - the client does not have access rights to the content , etc.",
        done: false,

        completedOn: "",
      },
      {
        title: "Installing Nodemon for Automatic Server Restarts.",
        done: false,

        completedOn: "",
      },
    ],
    "3. Some talk on Different Architectures 🏯": [
      {
        title: "Different Architectures in backend like MVC and SOA .",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding MVC Architecture Model , View , Control .",
        done: false,

        completedOn: "",
      },
      {
        title: "MVC in the context of REST APIs .",
        done: false,

        completedOn: "",
      },
    ],
    "4. Web Framework - Express.js 🚀": [
      {
        title: "what is Express.js and why to use it.",
        done: false,

        completedOn: "",
      },
      {
        title: "Setting Up Express Server .",
        done: false,

        completedOn: "",
      },
      {
        title: "Returning Response from the server.",
        done: false,

        completedOn: "",
      },
      {
        title: "Using Query Parameters and URL Parameters.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "HTTP Request - Some Important part of requests , Different Types of Requests - Get , Post , PUT , Patch , Delete .",
        done: false,

        completedOn: "",
      },
      {
        title: "Serving Static Files with express.static() .",
        done: false,

        completedOn: "",
      },
    ],
    "5. Template Engine - EJS 🚜": [
      {
        title:
          "What is Template Engine and What is the use of Template Engine.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Template Engine Option - Handlebars , EJS , Pug , jade but We’ll use EJS .",
        done: false,

        completedOn: "",
      },
      {
        title: "Setting Up Template Engine - Installed EJS template engine .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Rendering Our First Page using EJS and Some important syntax - <%= %> , <% %> , <%- %> .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Loop statement, Conditional statement and Locals in views - EJS .",
        done: false,

        completedOn: "",
      },
      {
        title: "Accessing the Static Files Inside EJS file.",
        done: false,

        completedOn: "",
      },
    ],
    "6. Middleware in Express.js (one of my favorite) 🐵": [
      {
        title: "Understanding the middleware in express.",
        done: false,

        completedOn: "",
      },
      {
        title: "Implementing middleware with express.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Different types of middleware : builtIn middleware , third-party middleware , custom middleware .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Different level of middleware : Application-Level , Router-Level .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Handeling Errors and Security with middleware : Error-Handling , Helmet , CORS .",
        done: false,

        completedOn: "",
      },
    ],
    "7. Handling file with Express 📁": [
      {
        title: "Understand Multer and its usecase?",
        done: false,

        completedOn: "",
      },
      {
        title: "Uploading file with multer.",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding Memory and Disk Storage.",
        done: false,

        completedOn: "",
      },
      {
        title: "Accessing uploaded file req.file .",
        done: false,

        completedOn: "",
      },
      {
        title: "Working with express.static .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Using Cloudinary or Imagekit for Real-time media processing APIs and Digital Asset Management.",
        done: false,

        completedOn: "",
      },
    ],
    "8. Beginning of Database Basics ( Bohot km theory ) 🗄️": [
      {
        title: "Relational and non-relational Databases : mongodb & mysql .",
        done: false,

        completedOn: "",
      },
      {
        title: "What is MongoDB ? Why Use It?",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Installing Compass and Understand how to access DB using terminal.",
        done: false,

        completedOn: "",
      },
      {
        title: "Setting Up MongoDB Locally and in the Cloud .",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding Datatypes Collections and Documents .",
        done: false,

        completedOn: "",
      },
      {
        title: "Connecting MongoDB to Node.js with Mongoose .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Database Relations - One to One , One to Many OR Many to One , Many to Many , Polymorphic .",
        done: false,

        completedOn: "",
      },
      {
        title: "Handling Relationships with Mongoose ( populate ).",
        done: false,

        completedOn: "",
      },
    ],
    "9. API Development(REST) ⛓": [
      {
        title: "What is a REST API?",
        done: false,

        completedOn: "",
      },
      {
        title: "Versioning in RESTful APIs - /v1/",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Using Postman for API Testing and developing - Send Requests , Save Collections , Write Tests .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Understanding and Working With Status code , 2xx (Success) , 4xx (Client Errors) , 5xx (Server Errors) .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Validating API Inputs Using libraries like express-validator or Sanitization .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Security Handling - Rate Limiting with express-rate-limit , XSS Attack , CSRF Attack , DOS Attack .",
        done: false,

        completedOn: "",
      },
    ],
    "10. Database Optimization for Fast response 🧘🏻": [
      {
        title:
          "Indexing for Performance with MongoDB :- Single-Field Indexes , Compound Indexes , Text Indexes , Wildcard Indexes .",
        done: false,

        completedOn: "",
      },
      {
        title: "Best practice with Indexing explain() .",
        done: false,

        completedOn: "",
      },
      {
        title: "Learning MongoDB Aggregation .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Comparison Operators - [ $eq , $ne , $lt , $gt , $lte , $gte , $in , $nin ]",
        done: false,

        completedOn: "",
      },
      {
        title: "Logical Operators - [ $not , $and , $or and $nor ]",
        done: false,

        completedOn: "",
      },
      {
        title: "Array[ $pop , $pull , $push and $addToSet ]",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Stages in Aggregation pipeline :- $match , $group , $project , $sort , $lookup .",
        done: false,

        completedOn: "",
      },
      {
        title: "Creating Database on Local and Atlas",
        done: false,

        completedOn: "",
      },
      {
        title: "Creating parallel pipeline with $facet .",
        done: false,

        completedOn: "",
      },
      {
        title: "Learning MongoDB Operators .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Understanding Different types of Operators :- Comparison , Regex , Update , Aggregation .",
        done: false,

        completedOn: "",
      },
    ],
    "11. Logging Backend : Express.js": [
      {
        title: "Why is Logging Important?",
        done: false,

        completedOn: "",
      },
      {
        title: "Setting Up Logging with Libraries winstone , Pino , Morgan .",
        done: false,

        completedOn: "",
      },
      {
        title: "Different mode of morgan , dev , short , tiny .",
        done: false,

        completedOn: "",
      },
      {
        title: "Error Handling and Logging.",
        done: false,

        completedOn: "",
      },
    ],
    "12. Production Wala Project Structure and Configuration 🗼": [
      {
        title: "Understanding the Basic Structure of application.",
        done: false,

        completedOn: "",
      },
      {
        title: "Learning File Naming Conventions, Git Configuration,",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Understanding Important Folders :- src/ , config/ , routes/ , utils/ .",
        done: false,

        completedOn: "",
      },
      {
        title: "Role of package.json , ENV and .gitignore .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Production Environment - PM2 , Error & Response Handling Configuration , CORS Configuration , async-handler.js .",
        done: false,

        completedOn: "",
      },
      {
        title: "Using and Configuring ESLint and Prettier for code formatting.",
        done: false,

        completedOn: "",
      },
      {
        title: "Testing APIs using Postman .",
        done: false,

        completedOn: "",
      },
    ],
    "13. Authentication and Authorization 🪪": [
      {
        title: "Difference Between Authentication & Authorization",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Working with Passwords and Authentication - Cookie Authentication , OAuth Authentication",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding Session and Token Authentication.",
        done: false,

        completedOn: "",
      },
      {
        title: "Implementing JWT Authentication :- jsonwebtoken JWT_SECRET .",
        done: false,

        completedOn: "",
      },
      {
        title: "Securing user password with bcrypt hashing salt .",
        done: false,

        completedOn: "",
      },
      {
        title: "Role-Based Access Control ( RBAC ).",
        done: false,

        completedOn: "",
      },
      {
        title: "Authenticating user with Express middleware .",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding Passport.js and its usecase?",
        done: false,

        completedOn: "",
      },
      {
        title: "Glancing through and Installing Passport.js",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Setting up Passport.js - passport-local , local-strategy , google-OAuth",
        done: false,

        completedOn: "",
      },
      {
        title: "express-sessions and using passport for authentication.",
        done: false,

        completedOn: "",
      },
    ],
    "14. Working Real time communication : WebSockets and socket.io 💬": [
      {
        title: "Understanding WebSockets protocol for realtime applications?",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Learning handshake , Persistent connection , Bidirectional communication , HTTP polling .",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding difference between WebSocket Vs Socket.io.",
        done: false,

        completedOn: "",
      },
      {
        title: "Working with socket.io for realtime applications.",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding usage of Rooms in Socket.io.",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding Middleware in Socket.io.",
        done: false,

        completedOn: "",
      },
    ],
    "15. Working With Caching - Local and Redis 🍄": [
      {
        title: "What is Caching and How to cache data locally?",
        done: false,

        completedOn: "",
      },
      {
        title: "What is Redis ?",
        done: false,

        completedOn: "",
      },
      {
        title: "Why Use Redis for Caching ?",
        done: false,

        completedOn: "",
      },
      {
        title: "Implementing Redis Caching in Node.js .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Advanced Redis Features TTL , Complex Data Structures , Pub/Sub .",
        done: false,

        completedOn: "",
      },
    ],
    "16. Error handling in express 🛑": [
      {
        title: "Basic Error Handling in Express next() .",
        done: false,

        completedOn: "",
      },
      {
        title: "Catching Specific Errors try & catch .",
        done: false,

        completedOn: "",
      },
      {
        title: "Creating Util Class for Error Handling.",
        done: false,

        completedOn: "",
      },
    ],
    "17. Testing Tools 🛠️": [
      {
        title: "Understanding Unit-Testing With Jest.",
        done: false,

        completedOn: "",
      },
      {
        title: "Cross Browser Testing and Why Is It Performed?",
        done: false,

        completedOn: "",
      },
      {
        title: "What Is Web Testing? and How to Test a Website.",
        done: false,

        completedOn: "",
      },
    ],
  },
  "Episode 5 - Merge": {
    "1. Generative AI and Applications 🤖": [
      {
        title:
          "Overview of Generative AI : Understanding its core concepts and potential.",
        done: false,

        completedOn: "",
      },
      {
        title: "Building an Authentication System with Generative AI .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Exploring Social Media Automation and Content Generation Projects.",
        done: false,

        completedOn: "",
      },
      {
        title: "Introduction to LangChain : Features and Practical Uses.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Developing Real-World Applications: AI-powered Resume Reviewer and Virtual Interview Assistant using tools like ChatGPT or Gemini .",
        done: false,

        completedOn: "",
      },
      {
        title: "Agentic-ai application",
        done: false,

        completedOn: "",
      },
      {
        title: "Working with multi agent system",
        done: false,

        completedOn: "",
      },
      {
        title: "MCP server",
        done: false,

        completedOn: "",
      },
    ],
    "2. Progressive Web App (PWA) Development. 🛜": [
      {
        title: "Overview of Progressive Web Apps and their benefits.",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding Service Workers and their role in PWA.",
        done: false,

        completedOn: "",
      },
      {
        title: "Lifecycle of a Service Worker ( Install , Activate , Fetch ).",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding the Manifest File.",
        done: false,

        completedOn: "",
      },
      {
        title: "Creating a Manifest.json File.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Key Properties (name, short_name, icons, start_url, theme_color, background_color)",
        done: false,

        completedOn: "",
      },
      {
        title: "Browser DevTools for PWA Debugging .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Implementing Lazy Loading and Code Splitting for improved performance.",
        done: false,

        completedOn: "",
      },
      {
        title: "Exploring various testing techniques for PWAs.",
        done: false,

        completedOn: "",
      },
      {
        title: "Optimizing performance with advanced caching strategies.",
        done: false,

        completedOn: "",
      },
    ],
    "3. DevOps Fundamentals - Docker 🐳": [
      {
        title:
          "Understanding DevOps and its importance in modern software development.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Learning about Continuous Integration and Continuous Deployment (CI/CD) pipelines .",
        done: false,

        completedOn: "",
      },
      {
        title: "Introduction to Docker and the basics of containerization .",
        done: false,

        completedOn: "",
      },
    ],
    "4. Building Microservices with Node.js 🏘️": [
      {
        title: "What are Microservices ? Why Use Them?",
        done: false,

        completedOn: "",
      },
      {
        title: "Monolithic vs Microservices Architecture.",
        done: false,

        completedOn: "",
      },
      {
        title: "Challenges of Microservices.",
        done: false,

        completedOn: "",
      },
      {
        title: "Creating a Node.js Microservice.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Designing a Microservice Architecture for a sample application.",
        done: false,

        completedOn: "",
      },
      {
        title: "Role of package.json in Each Microservice.",
        done: false,

        completedOn: "",
      },
      {
        title: "What is Inter-Service Communication?",
        done: false,

        completedOn: "",
      },
      {
        title: "Communication Patterns ( Synchronous vs Asynchronous ).",
        done: false,

        completedOn: "",
      },
      {
        title: "Role of an API Gateway in Microservices.",
        done: false,

        completedOn: "",
      },
      {
        title: "Setting Up an API Gateway with Express.js .",
        done: false,

        completedOn: "",
      },
      {
        title: "Microservices and Proxying Requests .",
        done: false,

        completedOn: "",
      },
      {
        title: "Rate Limiting and Authentication in API Gateway.",
        done: false,

        completedOn: "",
      },
      {
        title: "REST APIs for Communication",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding Message Brokers (e.g., Redis Pub/Sub ).",
        done: false,

        completedOn: "",
      },
      {
        title: "Event-Driven Communication with Redis or RabbitMQ .",
        done: false,

        completedOn: "",
      },
      {
        title: "OverView of Docker and Kubernetes .",
        done: false,

        completedOn: "",
      },
      {
        title: "Using Docker for microservice.",
        done: false,

        completedOn: "",
      },
    ],
    "5. Nextjs": [
      {
        title: "Next.js Fundamentals",
        done: false,

        completedOn: "",
      },
      {
        title: "File-based routing",
        done: false,

        completedOn: "",
      },
      {
        title: "Static assets & Image optimization",
        done: false,

        completedOn: "",
      },
      {
        title: "Dynamic routes ([id].js)",
        done: false,

        completedOn: "",
      },
      {
        title: "Rendering & Data Fetching",
        done: false,

        completedOn: "",
      },
      {
        title: "Styling in Next.js",
        done: false,

        completedOn: "",
      },
      {
        title: "Deployment",
        done: false,

        completedOn: "",
      },
    ],
    "6. Web3 Basics. ₿": [
      {
        title: "Understanding the concept and potential of Web3 .",
        done: false,

        completedOn: "",
      },
      {
        title: "Fundamentals of Blockchain technology and how it powers Web3.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Exploring Decentralized Applications ( DApps ) and their use cases.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Introduction to Smart Contracts : How they work and their applications.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Overview of Cryptocurrencies and their role in the Web3 ecosystem.",
        done: false,

        completedOn: "",
      },
    ],
    "7. Deployment ✈️": [
      {
        title: "We will be deploying the project on the cloud.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Easy and Smart - We’ll DigitalOcean App Platform (in-built load-balancer, scalable, containers) for Deploying our app.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Service providers give us a machine-like cloud [ AWS, GCP, Heroku, Azure ] but we’ll use AWS .",
        done: false,

        completedOn: "",
      },
      {
        title: "Launching Our First Machine using EC2 .",
        done: false,

        completedOn: "",
      },
      {
        title: "Setting up the Machine - SSH .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Pulling the code and clone the repository of the code to the main server.",
        done: false,

        completedOn: "",
      },
      {
        title: "Configuring the NGINX .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Masking the Domain On Our IP (We are now going to buy a new domain and Link it with cloud AWS).",
        done: false,

        completedOn: "",
      },
    ],
  },
  "DSA with JavaScript": {
    "1. Conditional Statements": [
      {
        title: "Understanding Conditional Statements",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Types of Conditional Statements if , if-else , if-else if , switch",
        done: false,

        completedOn: "",
      },
      {
        title: "Making decisions in a program based on inputs or variables.",
        done: false,

        completedOn: "",
      },
      {
        title: "Validating user data or input forms.",
        done: false,

        completedOn: "",
      },
      {
        title: "Creating interactive menus or options in applications.",
        done: false,

        completedOn: "",
      },
    ],
    "2. Loops, Nested Loops, Pattern Programming": [
      {
        title: "Undertsanding the use of Loops.",
        done: false,

        completedOn: "",
      },
      {
        title: "for loop.",
        done: false,

        completedOn: "",
      },
      {
        title: "while loop.",
        done: false,

        completedOn: "",
      },
      {
        title: "do-while loop.",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding the Use of Nested Loops.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Learning Pattern Programming - Pyramid patterns , right-angled triangles , and inverted triangles .",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding Control Flow statement break and continue",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Learning how to set correct conditions to avoid getting stuck in infinite loops.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Understand how to optimize nested loops for better performance and reduced time complexity.",
        done: false,

        completedOn: "",
      },
    ],
    "3. Array": [
      {
        title: "Understanding the use of Arrays.",
        done: false,

        completedOn: "",
      },
      {
        title: "Basic Manipulations - insertion , deletion , updation",
        done: false,

        completedOn: "",
      },
      {
        title: "Accessing Elements in Arrays .",
        done: false,

        completedOn: "",
      },
      {
        title: "Traversing Elements in Arrays .",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Array Algorithms - Two Pointer Algorithm , Rotation Algorithms , Kadane’s Algorithm , etc",
        done: false,

        completedOn: "",
      },
    ],
    "4. Object-Oriented Programming (OOP) in JavaScript": [
      {
        title: "Understanding Object-Oriented Programming",
        done: false,

        completedOn: "",
      },
      {
        title: "Learn how to define a class for creating objects.",
        done: false,

        completedOn: "",
      },
      {
        title: "Understand how to instantiate objects from a class",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Learn how the constructor() function initializes an object when it’s created.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Understand how this refers to the current object in the context.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Use this to access properties and methods within the same object.",
        done: false,

        completedOn: "",
      },
    ],
    "5. Strings in JavaScript": [
      {
        title: "Understanding Strings in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Learning String Manipulation Methods - concat() , slice() , substring() , replace() , replaceAll()",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Learning String Search and Check Operations - indexOf() , lastIndexOf() , includes() , startsWith() , endsWith()",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Learning String Transformations - toUpperCase() , toLowerCase() , trim()",
        done: false,

        completedOn: "",
      },
      {
        title: "Learning String Splitting and Joining: - split() , join()",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Embed variables and expressions in strings using backticks ( )`",
        done: false,

        completedOn: "",
      },
      {
        title: "Learning Escape Characters - \\n , \\t , \\’",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Algorithms on Strings - Reverse a String , Check for Palindrome , Find Longest Common Prefix , Character Frequency Count , Anagram Check",
        done: false,

        completedOn: "",
      },
    ],
    "6. Time and Space Complexity": [
      {
        title: "Understanding Time Complexity",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding the Big-O Notation.",
        done: false,

        completedOn: "",
      },
      {
        title: "Constant Time – O(1)",
        done: false,

        completedOn: "",
      },
      {
        title: "Logarithmic Time – O(log n)",
        done: false,

        completedOn: "",
      },
      {
        title: "Linear Time – O(n)",
        done: false,

        completedOn: "",
      },
      {
        title: "Linearithmic Time – O(n log n)",
        done: false,

        completedOn: "",
      },
      {
        title: "Quadratic Time – O(n²)",
        done: false,

        completedOn: "",
      },
      {
        title: "Exponential Time – O(2ⁿ)",
        done: false,

        completedOn: "",
      },
      {
        title: "Factorial Time – O(n!)",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Key Factors That Affect Complexity - Algorithm Design , Data Structure Choice , Problem Constraints",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Tips to Reduce Time Complexity - Avoid Nested Loops , Efficient Data Structures , Optimize Recursion , Divide and Conquer",
        done: false,

        completedOn: "",
      },
      {
        title: "Understanding what is Recursion and its use case",
        done: false,

        completedOn: "",
      },
    ],
    "7. Math Problems and Algorithms": [
      {
        title: "Understanding Mathematical Operations and Their Applications",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Mathematical operations like (pow) (sqrt) and greatest common divisor (HCF) are essential in various problem-solving scenarios.",
        done: false,

        completedOn: "",
      },
    ],
    "8. Advanced Problems on Array": [
      {
        title: "Understanding Advanced Array Concepts",
        done: false,

        completedOn: "",
      },
      {
        title: "Learning two-pointer approach ,",
        done: false,

        completedOn: "",
      },
      {
        title: "Learning prefix sums",
        done: false,

        completedOn: "",
      },
      {
        title: "Solving complex problems efficiently.",
        done: false,

        completedOn: "",
      },
      {
        title: "Multi-Dimensional Arrays in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title: "Working with Multi-Dimensional Arrays",
        done: false,

        completedOn: "",
      },
      {
        title: "Key Operations on Multi-Dimensional Arrays",
        done: false,

        completedOn: "",
      },
      {
        title: "Algorithms Using Multi-Dimensional Arrays",
        done: false,

        completedOn: "",
      },
      {
        title: "Multi-Dimensional Arrays in Real-World Scenarios",
        done: false,

        completedOn: "",
      },
    ],
    "9. Sorting Algorithms ,Time complexity and their application": [
      {
        title: "Learning Selection Sort",
        done: false,

        completedOn: "",
      },
      {
        title: "Learning Insertion Sort",
        done: false,

        completedOn: "",
      },
      {
        title: "Learning Merge Sort",
        done: false,

        completedOn: "",
      },
      {
        title: "Learning Quick Sort",
        done: false,

        completedOn: "",
      },
      {
        title: "Learning Cyclic Sort",
        done: false,

        completedOn: "",
      },
    ],
    "10. Binary Search and Its Algorithms": [
      {
        title: "Binary Search on Sorted Arrays",
        done: false,

        completedOn: "",
      },
      {
        title: "Variations of Binary Search",
        done: false,

        completedOn: "",
      },
      {
        title: "Binary Search on Infinite Arrays",
        done: false,

        completedOn: "",
      },
      {
        title: "Binary Search in Rotated Sorted Array",
        done: false,

        completedOn: "",
      },
      {
        title: "Binary Search on 2D Matrix",
        done: false,

        completedOn: "",
      },
      {
        title: "Real-World Use Cases of Binary Search",
        done: false,

        completedOn: "",
      },
    ],
    "11. Hashing (Set and Map) in JavaScript": [
      {
        title: "Understanding Hashing in JavaScript - s**et , map *",
        done: false,

        completedOn: "",
      },
      {
        title: "Working with Set in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Methods in Set - add(value) , delete(value) , has(value) , clear() , size",
        done: false,

        completedOn: "",
      },
      {
        title: "Working with Map in JavaScript",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Methods in Map - set(key, value) , get(key) , delete(key) , has(key) , clear() , size",
        done: false,

        completedOn: "",
      },
      {
        title: "Learning Algorithms Using Set & map",
        done: false,

        completedOn: "",
      },
    ],
    "12. Linked List in JavaScript": [
      {
        title: "Understanding Linked List - Data , Pointer",
        done: false,

        completedOn: "",
      },
      {
        title: "Singly Linked List.",
        done: false,

        completedOn: "",
      },
      {
        title: "Doubly Linked List.",
        done: false,

        completedOn: "",
      },
      {
        title: "Circular Linked List.",
        done: false,

        completedOn: "",
      },
      {
        title: "Creating a Node in Linked List:",
        done: false,

        completedOn: "",
      },
      {
        title: "Building a Linked List:",
        done: false,

        completedOn: "",
      },
      {
        title: "Traversing a Linked List:",
        done: false,

        completedOn: "",
      },
      {
        title: "Operations on Linked Lists - Insertion , Deletion , Searching",
        done: false,

        completedOn: "",
      },
      {
        title: "Algorithms Using Linked Lists",
        done: false,

        completedOn: "",
      },
    ],
    "13. Queue in JavaScript": [
      {
        title: "Implementation of Queue by Linked List and Array",
        done: false,

        completedOn: "",
      },
      {
        title: "Working with Queues - Basic Queue , Circular Queue",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Operations on Queues - Enqueue , Dequeue , Peek , IsEmpty , Size",
        done: false,

        completedOn: "",
      },
      {
        title: "Algorithms Using Queues",
        done: false,

        completedOn: "",
      },
      {
        title: "Applications of Queues",
        done: false,

        completedOn: "",
      },
    ],
    "14. Stack in JavaScript": [
      {
        title: "Understanding Stacks in javaScript",
        done: false,

        completedOn: "",
      },
      {
        title: "Implementation of Stack by Linked List and Array",
        done: false,

        completedOn: "",
      },
      {
        title: "Working with Stacks",
        done: false,

        completedOn: "",
      },
      {
        title: "Operations on Stacks - Push , Pop , Peek , IsEmpty , Size",
        done: false,

        completedOn: "",
      },
      {
        title: "Algorithms Using Stacks",
        done: false,

        completedOn: "",
      },
      {
        title: "Applications of Stacks",
        done: false,

        completedOn: "",
      },
    ],
    "15. Advanced Problems on Recursion and Backtracking": [
      {
        title: "Understanding Advanced Recursion and Backtracking",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Key Problems and Algorithms like N-Queens Problem , Sudoku Solver , Subset Sum , Word Search",
        done: false,

        completedOn: "",
      },
      {
        title: "Optimizing Recursive Solutions with Backtracking",
        done: false,

        completedOn: "",
      },
      {
        title: "Challenges with Recursion and Backtracking",
        done: false,

        completedOn: "",
      },
      {
        title: "Applications of Recursion and Backtracking",
        done: false,

        completedOn: "",
      },
    ],
    "16. Tree": [
      {
        title: "Understanding Binary Trees",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Types of Binary Trees - Full Binary Tree , Complete Binary Tree , Perfect Binary Tree",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Key Terminology in Binary Trees - Node , Root , Leaf , Height of a Tree , Depth of a Node , Level of a Node",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Binary Tree Operations - Insertion , Deletion , Traversal , Searching",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Binary Tree Algorithms - Height , Diameter , LCA , Symmetry Check",
        done: false,

        completedOn: "",
      },
      {
        title: "Applications of Binary Trees",
        done: false,

        completedOn: "",
      },
    ],
    "17. Binary Search Tree (BST):": [
      {
        title: "Understanding Binary Search Tree",
        done: false,

        completedOn: "",
      },
      {
        title: "Properties of Binary Search Tree",
        done: false,

        completedOn: "",
      },
      {
        title: "BST Operations -",
        done: false,

        completedOn: "",
      },
      {
        title: "Binary Search Tree Algorithms",
        done: false,

        completedOn: "",
      },
      {
        title: "Applications of Binary Search Tree",
        done: false,

        completedOn: "",
      },
      {
        title: "Advantages of Binary Search Tree",
        done: false,

        completedOn: "",
      },
    ],
  },
  "Aptitude and Reasoning": {
    "Classic Chapters › 1. Percentage": [
      {
        title: "Learn tips and tricks for percentages.",
        done: false,

        completedOn: "",
      },
      {
        title: "Solve basic, medium, and advanced questions.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs to master percentages.",
        done: false,

        completedOn: "",
      },
    ],
    "Classic Chapters › 2. Profit and Loss": [
      {
        title: "Concepts of Profit and loss",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Relationship between cost price, selling price, and mark-up price.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Solve practical scenarios involving discounts, successive transactions.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Sharpen your skills with MCQs to prepare for competitive exams.",
        done: false,

        completedOn: "",
      },
    ],
    "Classic Chapters › 3. Simple Interest": [
      {
        title: "Master the formula for calculating simple interest.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Differentiate between principal, interest rate, and time period.",
        done: false,

        completedOn: "",
      },
      {
        title: "Solve case-based problems related to borrowing and lending.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs for thorough preparation",
        done: false,

        completedOn: "",
      },
    ],
    "Classic Chapters › 4. Compound Interest": [
      {
        title: "Understand the growth of investments and savings.",
        done: false,

        completedOn: "",
      },
      {
        title: "Differentiate between simple interest and compound interest.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Solve problems with annual, semi-annual, and quarterly compounding.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs for preparation.",
        done: false,

        completedOn: "",
      },
    ],
    "Classic Chapters › 5. Ratio and Proportion": [
      {
        title: "Grasp the basics of ratios.",
        done: false,

        completedOn: "",
      },
      {
        title: "Solve problems on proportional relationships.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Analyze scenarios involving scaling, sharing, and dividing quantities.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs for preparation.",
        done: false,

        completedOn: "",
      },
    ],
    "Number Related Topics › 1. Number System": [
      {
        title:
          "Understand the classification of natural numbers, whole numbers, integers, rational numbers, and irrational numbers.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Master divisibility rules, factors, multiples, and place value.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Practice MCQs to improve understanding and problem-solving speed.",
        done: false,

        completedOn: "",
      },
    ],
    "Number Related Topics › 2. HCF and LCM": [
      {
        title: "Learn techniques to find HCF and LCM.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Understand their applications in scheduling and resource sharing.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Solve word problems involving time, distance, and recurring patterns.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs for competitive exam preparation.",
        done: false,

        completedOn: "",
      },
    ],
    "Number Related Topics › 3. Average": [
      {
        title: "Understand averages and their significance.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Solve problems on weighted averages, missing numbers, and group data.",
        done: false,

        completedOn: "",
      },
      {
        title: "Apply averages in performance analysis and time management.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs to enhance speed and accuracy.",
        done: false,

        completedOn: "",
      },
    ],
    "Speed Work and Time Related Topics › 1. Work and Time": [
      {
        title:
          "Understand the relationship between work, time, and efficiency.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Solve problems involving individuals or groups working together.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Analyze scenarios like alternating work schedules and work completion rates.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs problems.",
        done: false,

        completedOn: "",
      },
    ],
    "Speed Work and Time Related Topics › 2. Pipes and Cisterns": [
      {
        title: "Understand the analogy between pipes and work-time.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Solve problems with multiple pipes working together or alternately.",
        done: false,

        completedOn: "",
      },
      {
        title: "Address challenges like leaks or partial closure.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs to improve your skills.",
        done: false,

        completedOn: "",
      },
    ],
    "Speed Work and Time Related Topics › 3. Speed, Distance, and Time": [
      {
        title: "Master the formula: Speed = Distance / Time.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Solve problems on relative speed, average speed, and varying speeds.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs questions.",
        done: false,

        completedOn: "",
      },
    ],
    "Speed Work and Time Related Topics › 4. Problems on Trains": [
      {
        title:
          "Calculate the time for a train to cross poles, platforms, or other trains.",
        done: false,

        completedOn: "",
      },
      {
        title: "Apply relative speed in train-related problems.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs questions.",
        done: false,

        completedOn: "",
      },
    ],
    "Speed Work and Time Related Topics › 5. Boats and Streams": [
      {
        title:
          "Understand the impact of stream direction (upstream, downstream) on speed.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Solve problems on relative speed and effective speed in flowing water.",
        done: false,

        completedOn: "",
      },
      {
        title: "Analyze scenarios like rowing competitions or river crossings.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs to test your understanding.",
        done: false,

        completedOn: "",
      },
    ],
    "Probability and Combinations › 1. Permutations and Combinations": [
      {
        title:
          "Understand the difference between permutations (arrangement) and combinations (selection).",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Learn key formulas and techniques for calculating arrangements and selections.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Solve problems with factorials, repetition, and circular permutations.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs to improve problem-solving skills.",
        done: false,

        completedOn: "",
      },
    ],
    "Probability and Combinations › 2. Probability": [
      {
        title: "Understand probability as a measure of likelihood.",
        done: false,

        completedOn: "",
      },
      {
        title: "Learn formulas for calculating probability in events.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs to improve proficiency.",
        done: false,

        completedOn: "",
      },
    ],
    "Progressions › 1. Arithmetic Progression (AP)": [
      {
        title: "Understand Arithmetic Progression with a constant difference.",
        done: false,

        completedOn: "",
      },
      {
        title: "Derive formulas for general term (an) and sum of n terms (Sn).",
        done: false,

        completedOn: "",
      },
      {
        title: "Apply AP in real-life problem solving.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Solve problems on missing terms, specific terms, and sum of series.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs and concept-based questions.",
        done: false,

        completedOn: "",
      },
    ],
    "Progressions › 2. Geometric Progression (GP)": [
      {
        title: "Understand Geometric Progression with a constant ratio.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Solve problems on missing terms, specific terms, and sum of series.",
        done: false,

        completedOn: "",
      },
    ],
    "Miscellaneous Topics › 1. Calendar": [
      {
        title: "Understand days, months, leap years, and century years.",
        done: false,

        completedOn: "",
      },
      {
        title: "Learn Odd Days concept and calculation for day of the week.",
        done: false,

        completedOn: "",
      },
      {
        title: "Use key formulas to find the day for any given date.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Solve problems on repeating calendar years and calendar-based tricks.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs and scenario-based questions.",
        done: false,

        completedOn: "",
      },
    ],
    "Miscellaneous Topics › 2. Clocks": [
      {
        title:
          "Understand clock structure, minute hand, hour hand, and their movements.",
        done: false,

        completedOn: "",
      },
      {
        title: "Solve angle problems between clock hands.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Solve problems on overlaps, right angles, and opposite directions.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice clock puzzles and time calculation problems.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs and puzzle-based questions.",
        done: false,

        completedOn: "",
      },
    ],
  },
  "Logical Reasoning": {
    "1. Direction Sense": [
      {
        title:
          "Understand directions (North, South, East, West) and final direction after movements.",
        done: false,

        completedOn: "",
      },
      {
        title: "Track movements and turns (right/left) to find final position.",
        done: false,

        completedOn: "",
      },
      {
        title: "Solve problems with multiple directions and movement patterns.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs for speed and accuracy.",
        done: false,

        completedOn: "",
      },
    ],
    "2. Blood Relation": [
      {
        title:
          "Identify relationships like father , mother , brother , sister .",
        done: false,

        completedOn: "",
      },
      {
        title: "Analyze clues to trace family connections .",
        done: false,

        completedOn: "",
      },
      {
        title: "Solve problems with family trees and complex relationships.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs to improve deduction skills.",
        done: false,

        completedOn: "",
      },
    ],
    "3. Syllogism": [
      {
        title: "Understand logical reasoning and conclusion deduction.",
        done: false,

        completedOn: "",
      },
      {
        title: "Break down premises to check conclusions.",
        done: false,

        completedOn: "",
      },
      {
        title: "Work with All , Some , No premises.",
        done: false,

        completedOn: "",
      },
      {
        title: "Solve MCQs to identify valid/invalid conclusions.",
        done: false,

        completedOn: "",
      },
    ],
    "4. Arrangements": [
      {
        title: "Learn to arrange people or objects based on conditions.",
        done: false,

        completedOn: "",
      },
      {
        title: "Apply constraints like sitting together or specific positions.",
        done: false,

        completedOn: "",
      },
      {
        title: "Solve problems with multiple arrangement conditions .",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs to strengthen understanding.",
        done: false,

        completedOn: "",
      },
    ],
    "5. Series": [
      {
        title: "Understand number sequences and identify next terms.",
        done: false,

        completedOn: "",
      },
      {
        title:
          "Recognize patterns like arithmetic progressions , geometric progressions .",
        done: false,

        completedOn: "",
      },
      {
        title: "Solve problems with varying series types and difficulty.",
        done: false,

        completedOn: "",
      },
      {
        title: "Practice MCQs to improve pattern recognition.",
        done: false,

        completedOn: "",
      },
    ],
  },
  "Verbal Reasoning": {
    "1. Sentence Ordering": [
      {
        title: "Practice MCQs to improve sentence ordering skills.",
        done: false,

        completedOn: "",
      },
    ],
    "2. Error Identification": [
      {
        title: "Practice MCQs to sharpen error spotting and correction.",
        done: false,

        completedOn: "",
      },
    ],
    "3. Sentence Improvement": [
      {
        title: "Practice MCQs to improve sentence quality .",
        done: false,

        completedOn: "",
      },
    ],
  },
};

/* ======================= UTIL ======================= */

/**
 * Returns today's date in YYYY-MM-DD format
 */
// ✅ Local-safe "today" (YYYY-MM-DD)
const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Safe deep clone using JSON method
 * NOTE: Only use for pure JSON objects
 */
const deepClone = (o) => structuredClone(o || {});

/**
 * Converts path array to a readable string
 * Example: ["JS", "Basics", "Scope"] → "JS > Basics > Scope"
 */
const pathKey = (pathArr) => {
  return pathArr
    .map(
      (p) =>
        String(p)
          .trim() // remove leading/trailing spaces
          .replace(/\s+/g, "_") // convert spaces to _
          .replace(/[^\w_]/g, "") // remove invalid chars like > - :
          .toLowerCase() // normalize casing
    )
    .join("__"); // consistent and clean
};

/**
 * Creates unique key for item lists based on path + index
 */
const itemKey = (path, idx) => `${pathKey(path)} ## ${idx}`;

/**
 * Format ISO date → DD-MM-YYYY
 */
function formatDateDDMMYYYY(iso) {
  if (!iso) return "";

  const d = new Date(iso);
  if (isNaN(d)) return iso;

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getFullYear());

  return `${dd}-${mm}-${yyyy}`;
}

// ✅ Local-safe date formatter (NO timezone shift)
// Returns DD-MM-YYYY
function formatLocalDDMMYYYY(date) {
  if (!date) return "";
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

// ✅ Local-safe ISO-like storage (YYYY-MM-DD)
function formatLocalISO(date) {
  if (!date) return "";
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Safely get any nested node reference from tree using path array
 * Example: ["JS", "Basics", "Scope"]
 */
function getRefAtPath(obj, path) {
  let ref = obj;

  for (const part of path) {
    if (!ref || typeof ref !== "object") return undefined;
    ref = ref[part];
  }

  return ref;
}
/**
 * Calculates total items + done items from a section
 * Works for both array nodes and recursive objects
 * Uses a Set to guard against accidental circular references
 */
function totalsOf(node, visited = new WeakSet()) {
  if (!node) return { total: 0, done: 0, pct: 0 };

  // Prevent infinite recursion
  if (typeof node === "object") {
    if (visited.has(node)) {
      return { total: 0, done: 0, pct: 0 };
    }
    visited.add(node);
  }

  // Leaf array case
  if (Array.isArray(node)) {
    const total = node.length;
    const done = node.filter((item) => item?.done).length;

    return {
      total,
      done,
      pct: total ? Math.round((done / total) * 100) : 0,
    };
  }

  // Recursively sum children
  let total = 0;
  let done = 0;

  for (const value of Object.values(node)) {
    const r = totalsOf(value, visited);
    total += r.total;
    done += r.done;
  }

  return {
    total,
    done,
    pct: total ? Math.round((done / total) * 100) : 0,
  };
}

/* ======================= MAIN ======================= */
/* ======================= MAIN ======================= */
export default function Syllabus({
  dashboardState,
  setDashboardState,
  updateDashboard,
}) {
  // ==================== ALL HOOKS AT TOP ====================
  const treeRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Control flags
  const [ready, setReady] = useState(false);

  // Force UI refresh when ref mutates
  const [, forceRender] = useState(0);

  // UI state
  const [showLastStudied, setShowLastStudied] = useState(true);
  const [query, setQuery] = useState("");
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [milestone, setMilestone] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Backend
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://fitness-backend-laoe.onrender.com/api/state";

  // Derived data (SAFE)
  const meta = dashboardState?.syllabus_meta || {};
  const nr = dashboardState?.syllabus_notes || {};
  const daySet = new Set(dashboardState?.syllabus_streak || []);
  const lastStudied = dashboardState?.syllabus_lastStudied || "";
  const LAST_STUDIED_HIDE_MINUTES = 10;

  // Single source of truth
  const tree = treeRef.current;

  // ==================== ALL EFFECTS (CONSOLIDATED) ====================

  // ==================== ALL EFFECTS (CLEAN & CORRECT) ====================

  // 🔹 EFFECT 1: LOAD SYLLABUS FROM BACKEND (RUNS ONCE)
  useEffect(() => {
    let cancelled = false;

    async function loadSyllabus() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        if (cancelled) return;

        if (
          data?.syllabus_tree_v2 &&
          typeof data.syllabus_tree_v2 === "object" &&
          Object.keys(data.syllabus_tree_v2).length > 0
        ) {
          // ✅ Existing user → load backend data
          treeRef.current = structuredClone(data.syllabus_tree_v2);
        } else {
          // 🆕 First-time user → seed from TREE
          treeRef.current = structuredClone(TREE);
        }

        setReady(true);
        forceRender((v) => v + 1);
      } catch (err) {
        console.error("❌ Failed to load syllabus:", err);

        // Fallback to TREE if backend fails
        treeRef.current = structuredClone(TREE);
        setReady(true);
        forceRender((v) => v + 1);
      }
    }

    loadSyllabus();
    return () => {
      cancelled = true;
    };
  }, []);

  // 🔹 EFFECT 2: CLEANUP DEBOUNCED SAVE ON UNMOUNT
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // 🔹 EFFECT 3: AUTO-HIDE "LAST STUDIED"
  useEffect(() => {
    if (!lastStudied) return;

    setShowLastStudied(true);

    const timer = setTimeout(
      () => setShowLastStudied(false),
      LAST_STUDIED_HIDE_MINUTES * 60 * 1000
    );

    return () => clearTimeout(timer);
  }, [lastStudied, LAST_STUDIED_HIDE_MINUTES]);

  // 🔹 EFFECT 4: SCROLL LISTENER FOR "BACK TO TOP"
  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 400);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ==================== MEMOS ====================

  // ✅ GRAND TOTALS — ALWAYS USE treeRef (NOT dashboardState)
  const grand = useMemo(() => {
    if (!tree) return { total: 0, done: 0, pct: 0 };
    return totalsOf(tree, new WeakSet());
  }, [tree]);

  // ✅ FILTERED TREE (SEARCH)
  const filtered = useMemo(() => {
    if (!tree) return {};
    if (!query.trim()) return tree;

    const q = query.toLowerCase();

    function filterNode(node) {
      if (Array.isArray(node)) {
        const items = node.filter((it) =>
          (it.title || "").toLowerCase().includes(q)
        );
        return items.length ? items : null;
      }

      if (!node || typeof node !== "object") return null;

      const out = {};
      for (const [k, v] of Object.entries(node)) {
        const child = filterNode(v);
        if (child) out[k] = child;
      }

      return Object.keys(out).length ? out : null;
    }

    return filterNode(tree) || {};
  }, [tree, query]);

  // ==================== CALLBACKS ====================

  // 🔹 Toggle open / close (UI-only, no backend timestamp)
  const toggleOpen = useCallback(
    (path) => {
      const key = pathKey(path);

      setDashboardState((prev) => {
        const current = prev?.syllabus_meta || {};
        const prevOpen = current[key]?.open || false;

        return {
          ...prev,
          syllabus_meta: {
            ...current,
            [key]: {
              ...(current[key] || {}),
              open: !prevOpen,
            },
          },
        };
      });
    },
    [setDashboardState]
  );

  // =========================================================
  // 🔥 FIXED: Set deadline on section + cascade to tasks
  // =========================================================
  const setTargetDate = (path, date) => {
    const key = pathKey(path);

    // 1️⃣ Clone meta safely
    const updatedMeta = { ...meta };

    const setMetaForKey = (k, d) => {
      if (d) {
        updatedMeta[k] = { ...(updatedMeta[k] || {}), targetDate: d };
      } else if (updatedMeta[k]) {
        const copy = { ...updatedMeta[k] };
        delete copy.targetDate;
        if (Object.keys(copy).length === 0) delete updatedMeta[k];
        else updatedMeta[k] = copy;
      }
    };

    // 2️⃣ Clone notes safely
    const newNotes = { ...(nr || {}) };

    // 3️⃣ Cascade through treeRef ONLY
    const cascade = (node, currentPath) => {
      const currentKey = pathKey(currentPath);
      setMetaForKey(currentKey, date);

      if (Array.isArray(node)) {
        node.forEach((_, idx) => {
          const itemK = itemKey(currentPath, idx);
          const existing = newNotes[itemK] || {};

          if (date) {
            newNotes[itemK] = { ...existing, deadline: date };
          } else {
            const clone = { ...existing };
            delete clone.deadline;
            if (Object.keys(clone).length === 0) delete newNotes[itemK];
            else newNotes[itemK] = clone;
          }
        });
        return;
      }

      if (node && typeof node === "object") {
        for (const [childKey, childVal] of Object.entries(node)) {
          cascade(childVal, [...currentPath, childKey]);
        }
      }
    };

    const subtree = getRefAtPath(treeRef.current, path);
    if (subtree) cascade(subtree, path);

    // 4️⃣ Persist ONLY what changed
    updateDashboard({
      syllabus_meta: updatedMeta,
      syllabus_notes: newNotes,
    });
  };

  // =========================================================
  // 🔹 Set section target percent
  // =========================================================
  const setSectionTargetPct = (secKey, pct) => {
    const key = Array.isArray(secKey) ? pathKey(secKey) : pathKey([secKey]);

    updateDashboard({
      syllabus_meta: {
        ...meta,
        [key]: {
          ...(meta[key] || {}),
          targetPct: Number(pct || 0),
        },
      },
    });
  };

  // =========================================================
  // 🔥 Mark / Unmark ALL tasks in a section
  // =========================================================
  const setAllAtPath = (path, val) => {
    const node = getRefAtPath(treeRef.current, path);
    let lastItem = null;

    function mark(n) {
      if (!n) return;

      if (Array.isArray(n)) {
        n.forEach((it) => {
          if (it && typeof it === "object") {
            it.done = val;
            it.completedOn = val ? todayISO() : "";
            if (val) lastItem = it;
          }
        });
        return;
      }

      if (n && typeof n === "object") {
        Object.values(n).forEach(mark);
      }
    }

    mark(node);

    // UI refresh
    forceRender((n) => n + 1);

    // Persist ONLY what changed
    const updates = { syllabus_tree_v2: treeRef.current };

    if (val && lastItem) {
      updates.syllabus_lastStudied = `${
        lastItem.title
      } @ ${new Date().toLocaleString("en-IN")}`;
      updates.syllabus_streak = Array.from(new Set([...daySet, todayISO()]));
    }

    updateDashboard(updates);
  };

  // =========================================================
  // 🔥 Mark / Unmark SINGLE task
  // =========================================================
  const markTask = (path, idx, val) => {
    const parent = getRefAtPath(treeRef.current, path.slice(0, -1));
    const leafKey = path[path.length - 1];
    const item = parent?.[leafKey]?.[idx];
    if (!item) return;

    item.done = val;
    item.completedOn = val ? todayISO() : "";

    forceRender((x) => x + 1);

    const updates = { syllabus_tree_v2: treeRef.current };

    if (val) {
      updates.syllabus_lastStudied = `${
        item.title
      } @ ${new Date().toLocaleString("en-IN")}`;
      updates.syllabus_streak = Array.from(new Set([...daySet, todayISO()]));
    }

    updateDashboard(updates);
  };

  // =========================================================
  // 🔥 Task deadline setter (NOT TREE)
  // =========================================================
  const setTaskDeadline = (path, idx, date) => {
    const itemK = itemKey(path, idx);
    const updatedNotes = { ...(nr || {}) };
    const existing = updatedNotes[itemK] || {};

    if (date) {
      updatedNotes[itemK] = { ...existing, deadline: date };
    } else {
      const clone = { ...existing };
      delete clone.deadline;
      if (Object.keys(clone).length === 0) delete updatedNotes[itemK];
      else updatedNotes[itemK] = clone;
    }

    // Save ONLY notes
    updateDashboard({
      syllabus_notes: updatedNotes,
    });
  };

  /* ======================= NOTES ======================= */

  // ✅ Notes updater (NO tree, NO manual fetch)
  const setNR = useCallback(
    (newNR) => {
      let updatedNotes;

      if (typeof newNR === "function") {
        updatedNotes = newNR(nr || {});
      } else {
        updatedNotes = newNR;
      }

      updateDashboard({
        syllabus_notes: updatedNotes,
      });
    },
    [nr, updateDashboard]
  );

  /* ======================= EXPORT ======================= */
  function exportProgress() {
    const payload = {
      syllabus_tree_v2: treeRef.current,
      syllabus_meta: meta,
      syllabus_notes: nr,
      syllabus_streak: Array.from(daySet),
      syllabus_lastStudied: lastStudied,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "syllabus_backup.json";
    a.click();
  }

  /* ======================= IMPORT ======================= */
  function importProgress(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);

        // 🔥 Validate minimal shape
        if (!data.syllabus_tree_v2) {
          alert("❌ Invalid syllabus file");
          return;
        }

        // Update ref FIRST
        treeRef.current = structuredClone(data.syllabus_tree_v2);
        forceRender((v) => v + 1);

        // Save EVERYTHING properly
        await updateDashboard({
          syllabus_tree_v2: treeRef.current,
          syllabus_meta: data.syllabus_meta || {},
          syllabus_notes: data.syllabus_notes || {},
          syllabus_streak: data.syllabus_streak || [],
          syllabus_lastStudied: data.syllabus_lastStudied || "",
        });

        alert("✅ Syllabus imported successfully");
      } catch (err) {
        console.error(err);
        alert("❌ Import failed. Invalid file.");
      }
    };

    reader.readAsText(file);
  }

  /* ======================= GENERATE SMART PLAN ======================= */
  const generateSmartPlan = (availableMins) => {
    const leaves = [];

    function walk(node, path = []) {
      if (Array.isArray(node)) {
        node.forEach((it, idx) => {
          if (!it.done) {
            const itemK = itemKey(path, idx);
            const noteData = nr[itemK];

            leaves.push({
              title: it.title,
              deadline: noteData?.deadline || null,
              estimate: 0.5,
            });
          }
        });
        return;
      }

      for (const [key, v] of Object.entries(node || {})) {
        walk(v, [...path, key]);
      }
    }

    walk(treeRef.current, []);

    const sorted = leaves.sort((a, b) => {
      const da = a.deadline ? Date.parse(a.deadline) : Infinity;
      const db = b.deadline ? Date.parse(b.deadline) : Infinity;
      return da - db;
    });

    const plan = [];
    let remaining = availableMins;

    for (const t of sorted) {
      const mins = Math.round(t.estimate * 60);
      if (remaining >= mins) {
        plan.push(t);
        remaining -= mins;
      }
    }

    return { plan, remaining };
  };

  /* ==================== EARLY RETURNS ==================== */

  if (!ready || !treeRef.current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900">
        <div className="flex flex-col items-center gap-4 px-6 py-5 rounded-2xl border border-emerald-400/40 bg-black/60 shadow-[0_18px_45px_rgba(0,0,0,0.8)]">
          {/* Spinner ring */}
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30" />
            <div className="absolute inset-0 rounded-full border-t-2 border-emerald-400 animate-spin" />
            <div className="absolute inset-3 rounded-full bg-emerald-500/10" />
          </div>

          {/* Text */}
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold tracking-wide text-emerald-200">
              Initializing syllabus core…
            </p>
            <p className="text-[11px] text-emerald-100/70">
              Loading roadmap from neural storage. Please hold position.
            </p>
          </div>

          {/* Dots */}
          <div className="flex gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-bounce [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-200 animate-bounce [animation-delay:240ms]" />
          </div>
        </div>
      </div>
    );
  }

  // ==================== MAIN RENDER ====================

  return (
    <div
      className="
  min-h-[80vh] rounded-xl p-2
  text-[#dceee8] dark:text-[#E6F1FF]
  bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] 
  dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
  dark:border-[#00D1FF33] md:mt-7 lg:mt-0
"
    >
      {/* Header Section */}
      <header
        className="
    sticky top-0 z-40 bg-[#020617]/95 backdrop-blur-2xl
    border-b border-white/10 rounded-xl
  "
      >
        <div className="max-w-7xl mx-auto px-3 py-1">
          <div
            className="
        rounded-2xl px-2 py-1 md:px-5 md:py-4
        bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132]
    dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#0A1F30] dark:to-[#000814]
        border border-white/10
        shadow-[0_18px_45px_rgba(0,0,0,0.6)]
      "
          >
            {/* Top row: title + streak + progress */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              {/* Left: title + meta */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-400/40 text-sm">
                    📚
                  </span>
                  <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-50">
                    Jay&apos;s Web Dev Syllabus 2026
                  </h1>
                </div>
                <p className="text-[11px] md:text-xs text-slate-300/80">
                  Structured roadmap with streaks, exports and safe reset.
                </p>
              </div>

              {/* Right: streak + global progress */}
              <div className="flex flex-wrap items-center justify-start md:justify-end gap-2">
                {/* Streak pill */}
                <span
                  className="inline-flex items-center gap-1.5
                   px-3 py-1.5 rounded-full text-[12px] font-semibold
                   bg-gradient-to-r from-emerald-400 to-emerald-300
                   text-[#022c22] border border-emerald-900/40
                   shadow-[0_0_12px_rgba(16,185,129,0.45)]
                 "
                >
                  🔥 <span>Streak</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-900/10 text-xs font-bold">
                    {Array.from(daySet).length}d
                  </span>
                </span>
              </div>
            </div>

            {/* Middle row: actions */}
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
              {/* Last studied (keeps your current logic) */}
              <div className="text-[11px] md:text-xs text-slate-200 flex items-center gap-1 min-h-[20px]">
                {showLastStudied &&
                  (lastStudied ? (
                    <span className="inline-flex items-center gap-1 text-emerald-200">
                      📘 <span>Last studied:</span>
                      <span className="font-medium text-emerald-100">
                        {lastStudied}
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      📭 <span>No topics completed yet.</span>
                    </span>
                  ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap justify-end gap-1.5">
                {/* Expand */}
                <button
                  onClick={() => {
                    const curr = dashboardState.syllabus_meta || {};
                    const updated = { ...curr };
                    Object.keys(updated).forEach((k) => {
                      updated[k] = { ...(updated[k] || {}), open: true };
                    });
                    updateDashboard({ syllabus_meta: updated });
                  }}
                  className="px-3 py-1.5 rounded-xl text-[11px] md:text-xs
bg-slate-900/80 text-slate-100
border border-slate-600/70
shadow-sm
transition
hover:bg-slate-800 hover:-translate-y-[1px] hover:shadow-[0_0_12px_rgba(148,163,184,0.6)]
active:translate-y-[1px] active:scale-[0.97] active:shadow-sm
            "
                >
                  Expand
                </button>

                {/* Collapse */}
                <button
                  onClick={() => {
                    const curr = dashboardState.syllabus_meta || {};
                    const updated = { ...curr };
                    Object.keys(updated).forEach((k) => {
                      updated[k] = { ...(updated[k] || {}), open: false };
                    });
                    updateDashboard({ syllabus_meta: updated });
                  }}
                  className="px-3 py-1.5 rounded-xl text-[11px] md:text-xs
bg-slate-900/80 text-slate-100
border border-slate-600/70
shadow-sm
transition
hover:bg-slate-800 hover:-translate-y-[1px] hover:shadow-[0_0_12px_rgba(148,163,184,0.6)]
active:translate-y-[1px] active:scale-[0.97] active:shadow-sm
            "
                >
                  Collapse
                </button>

                {/* Reset */}
                <button
                  onClick={async () => {
                    if (
                      !confirm(
                        "⚠️ Reset ALL syllabus progress? This CANNOT be undone!"
                      )
                    )
                      return;

                    const resetTree = structuredClone(TREE);

                    // Clear refs + UI immediately
                    treeRef.current = resetTree;
                    forceRender((v) => v + 1);

                    // Proper single-source update
                    await updateDashboard({
                      syllabus_tree_v2: resetTree,
                      syllabus_meta: {},
                      syllabus_notes: {},
                      syllabus_streak: [],
                      syllabus_lastStudied: "",
                    });

                    alert("✅ RESET COMPLETE");
                  }}
                  className="px-3 py-1.5 rounded-xl text-[11px] md:text-xs
bg-gradient-to-r from-red-600 to-red-500
text-white border border-red-400/80
shadow-[0_0_10px_rgba(248,113,113,0.7)]
transition
hover:brightness-110 hover:-translate-y-[1px] hover:shadow-[0_0_18px_rgba(248,113,113,0.95)]
active:translate-y-[1px] active:scale-[0.97] active:shadow-sm

  "
                >
                  Reset
                </button>

                {/* Export */}
                <button
                  onClick={exportProgress}
                  className="px-3 py-1.5 rounded-xl text-[11px] md:text-xs
bg-slate-900/80 text-slate-100
border border-slate-600/70
shadow-sm
transition
hover:bg-slate-800 hover:-translate-y-[1px] hover:shadow-[0_0_12px_rgba(52,211,153,0.7)]
active:translate-y-[1px] active:scale-[0.97] active:shadow-sm

            "
                >
                  📤 Export
                </button>

                {/* Import */}
                <label
                  className="px-3 py-1.5 rounded-xl text-[11px] md:text-xs cursor-pointer
bg-slate-900/80 text-slate-100
border border-slate-600/70
shadow-sm
transition
hover:bg-slate-800 hover:-translate-y-[1px] hover:shadow-[0_0_12px_rgba(59,130,246,0.7)]
active:translate-y-[1px] active:scale-[0.97] active:shadow-sm

            "
                >
                  📥 Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importProgress}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Bottom row: progress bar full-width on mobile */}
            <div className="mt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-300 sm:mb-1">
                <span>
                  {grand.done}/{grand.total} topics
                </span>
                <span className="text-emerald-300 font-semibold">
                  {grand.pct}%
                </span>
              </div>

              <div className="relative h-2.5 rounded-full bg-slate-900/80 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50/10 to-transparent" />
                <div
                  className={`
              h-full rounded-full transition-all duration-700 ease-out
              ${
                grand.pct < 25
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-300 shadow-[0_0_6px_#22c55e]"
                  : grand.pct < 50
                  ? "bg-gradient-to-r from-emerald-300 to-lime-300 shadow-[0_0_6px_#4ade80]"
                  : grand.pct < 75
                  ? "bg-gradient-to-r from-lime-300 to-cyan-300 shadow-[0_0_6px_#a7f3d0]"
                  : "bg-gradient-to-r from-rose-500 to-red-400 shadow-[0_0_8px_#ef4444]"
              }
            `}
                  style={{
                    width: `${grand.pct}%`,
                    minWidth: grand.pct > 0 ? "6px" : "6px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* === Search Bar === */}
      <div className="w-full px-3 mt-4 mb-2">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder=" Search syllabus topics..."
              className="
                w-full px-4 py-3 pl-12 rounded-xl
                bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132]
                dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
                border border-[#0B5134]/60 dark:border-[#00D1FF33]
                text-[#d9ebe5] dark:text-[#E6F1FF]
                placeholder:text-[#a7f3d0]/50 dark:placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-[#00d1b2]/50
                focus:border-[#00d1b2]/70
                shadow-[0_0_15px_rgba(0,0,0,0.2)]
                transition-all duration-200
              "
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a7f3d0]/70 dark:text-gray-400 pointer-events-none">
              🔍
            </div>
            {query && (
              <button
                onClick={() => setQuery("")}
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  px-2 py-1 rounded-md
                  text-[#d9ebe5] dark:text-gray-300
                  hover:bg-[#0B5134]/40 dark:hover:bg-gray-700/30
                  transition-colors
                  text-sm
                "
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          {query && (
            <div className="mt-2 text-xs text-[#a7f3d0]/70 dark:text-gray-400">
              {Object.keys(filtered).length > 0 ? (
                <span>Found {Object.keys(filtered).length} section(s)</span>
              ) : (
                <span>No matches found</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* === Combined Layout (Planner + Topics) === */}
      <div className="w-full max-w-7xl px-3 mt-2 pb-6 grid grid-cols-1 lg:grid-cols-10 gap-1">
        {/* RIGHT SIDE (above on mobile) */}
        <div className="order-1 lg:order-2 lg:col-span-4 space-y-6">
          {/* 🗓️ Daily Planner */}
          <div
            className="
           rounded-2xl 
           border border-[#1a4a39]/40 
           backdrop-blur-sm p-4
           shadow-[0_0_20px_rgba(0,0,0,0.2)]
           bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132]
           dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#0A1F30] dark:to-[#000814]
           dark:border-gray-800
           "
          >
            <h2 className="font-semibold mb-2">🗓️ Daily Auto Planner</h2>

            <DailyPlanner tree={tree} nr={nr} />
          </div>

          {/* 🤖 Smart Suggest */}
          <div
            className="rounded-2xl border border-[#1a4a39]/40
             backdrop-blur-sm p-4 shadow-[0_0_20px_rgba(0,0,0,0.2)]-sm
             bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132]
             dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#0A1F30] dark:to-[#000814]"
          >
            <SmartSuggest generateSmartPlan={generateSmartPlan} tree={tree} />
          </div>
        </div>
        {/* LEFT SIDE — All Topics */}
        <div className="order-2 lg:order-1 lg:col-span-6 space-y-4 ">
          <main className="w-full px-0 md:px-1 space-y-4">
            {Object.entries(filtered)
              .filter(([k]) => k !== "__normalized")
              .map(([secKey, node]) => (
                <SectionCard
                  key={secKey}
                  secKey={secKey}
                  node={node}
                  meta={meta}
                  nr={nr}
                  setNR={setNR}
                  setSectionTargetPct={setSectionTargetPct}
                  setTargetDate={setTargetDate}
                  toggleOpen={toggleOpen} // ✅ USE ONLY THIS
                  setAllAtPath={setAllAtPath}
                  markTask={markTask}
                  setTaskDeadline={setTaskDeadline}
                />
              ))}
          </main>
        </div>
      </div>

      {milestone && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-emerald-500 text-white shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          {milestone}
        </div>
      )}
    </div>
  );
}

<style>
  {`

  .dark-calendar {
  background: #051C14 !important;
  border: 2px solid #2F6B60 !important;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.react-datepicker__header {
  background: #0B5134 !important;
  border-bottom: 1px solid #2F6B60 !important;
}

.react-datepicker__day {
  color: #d9ebe5 !important;
}

.react-datepicker__day:hover {
  background: #2F6B60 !important;
}

.react-datepicker__day--selected {
  background: #00d1b2 !important;
}

  /* Custom scrollbar for better aesthetics */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  /* 🔥 Moving diagonal stripes */
.bg-stripes {
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255,255,255,0.15),
    rgba(255,255,255,0.15) 6px,
    transparent 6px,
    transparent 12px
  );
  background-size: 200% 100%;
}

/* 🔥 Wave shimmer */
.bg-wave {
  background-image: linear-gradient(
    110deg,
    transparent 25%,
    rgba(255,255,255,0.12) 50%,
    transparent 75%
  );
  background-size: 300% 100%;
}

/* Stripes Animation */
@keyframes stripeMove {
  from { background-position: 0 0; }
  to { background-position: 200% 0; }
}
.animate-stripes {
  animation: stripeMove 3s linear infinite;
}

/* Smooth Wave Animation */
@keyframes waveMove {
  from { background-position: 0% 50%; }
  to { background-position: 100% 50%; }
}
.animate-wave {
  animation: waveMove 3.5s ease-in-out infinite;
}

/* Heartbeat effect when >= 90% */
@keyframes heartbeat {
  0% { transform: scale(1); }
  20% { transform: scale(1.2); }
  40% { transform: scale(1); }
  60% { transform: scale(1.15); }
  80% { transform: scale(1); }
  100% { transform: scale(1); }
}
.animate-heartbeat {
  animation: heartbeat 1s infinite;
}

.bg-shimmer {
  background: linear-gradient(
    120deg,
    transparent 30%,
    rgba(255,255,255,0.5) 50%,
    transparent 70%
  );
  background-size: 200% 100%;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

.animate-shimmer {
  animation: shimmer 3s linear infinite;
}


    `}
</style>;

/* ======================= Main Section ======================= */
// ------------------ TASK ITEM (must be top-level) ------------------
function TaskItem({ it, idx, path, nr, setNR, markTask, setTaskDeadline }) {
  const key = itemKey(path, idx);

  // ✅ FIX: completion date comes from TREE, not notes
  const completedDate = it.completedOn;
  const deadline = nr[key]?.deadline;

  const buttonRef = useRef(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });

  const getDaysDifference = () => {
    if (!it.done || !completedDate || !deadline) return null;

    const completed = new Date(completedDate);
    const due = new Date(deadline);
    const diffTime = due.getTime() - completed.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysDiff = getDaysDifference();

  return (
    <>
      <li
        className={`
          p-2.5 rounded-lg border transition-all duration-200 mt-2
          ${
            it.done
              ? "border-[#00d1b2]/20 bg-[#0B2F2A]/30 opacity-90"
              : "border-[#00d1b2]/40 bg-[#0B2F2A]/50 hover:bg-[#0B2F2A]/70 hover:border-[#00d1b2]/60"
          }
        `}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Checkbox */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                markTask(path, idx, !it.done);
              }}
              className={`
                shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center 
                transition-all cursor-pointer font-bold text-xs
                ${
                  it.done
                    ? "bg-[#00d1b2] border-[#00d1b2] text-black"
                    : "bg-transparent border-[#00d1b2]/50 hover:border-[#00d1b2] hover:bg-[#00d1b2]/10"
                }
              `}
            >
              {it.done && "✓"}
            </button>

            {/* Title */}
            <div
              onClick={() => markTask(path, idx, !it.done)}
              className={`
                cursor-pointer text-sm break-words flex-1 transition-all duration-200
                ${
                  it.done
                    ? "line-through opacity-70 text-gray-400"
                    : "text-[#d9ebe5]"
                }
              `}
            >
              {it.title}
            </div>
          </div>

          {/* Controls */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 shrink-0"
          >
            <input
              type="number"
              min={0}
              max={100}
              step="0.25"
              value={nr[key]?.estimate ?? 0.5}
              onChange={(e) =>
                setNR((old) => ({
                  ...old,
                  [key]: {
                    ...(old[key] || {}),
                    estimate: Number(e.target.value),
                  },
                }))
              }
              className="w-12 text-xs rounded px-1.5 py-1 border border-[#00d1b2]/40 bg-[#051C14] text-[#d9ebe5]"
            />
            <span className="text-[10px] text-gray-500">h</span>

            <button
              ref={buttonRef}
              onClick={(e) => {
                e.stopPropagation();
                if (!showDatePicker && buttonRef.current) {
                  const rect = buttonRef.current.getBoundingClientRect();
                  const calendarWidth = 240;

                  let left = rect.left + window.scrollX;
                  let top = rect.bottom + window.scrollY + 5;

                  if (left + calendarWidth > window.innerWidth)
                    left = window.innerWidth - calendarWidth - 10;
                  if (top + 280 > window.innerHeight + window.scrollY)
                    top = rect.top + window.scrollY - 280;

                  setPickerPosition({ top, left });
                }
                setShowDatePicker((s) => !s);
              }}
              className="text-[11px] border rounded px-2 py-1 border-[#00d1b2]/40 bg-[#051C14] text-[#d9ebe5]"
            >
              📅 {deadline ? formatDateDDMMYYYY(deadline) : "Set"}
            </button>

            {deadline && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTaskDeadline(path, idx, "");
                }}
                className="w-6 h-6 flex items-center justify-center border border-red-500/50 rounded bg-red-900/20 text-xs text-red-400"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {(deadline || (it.done && completedDate)) && (
          <div className="mt-2 pl-6 text-[10px]">
            {deadline && !it.done && (
              <div className="flex items-center gap-1 text-[#a7f3d0]">
                ⏰ Due: {formatDateDDMMYYYY(deadline)}
              </div>
            )}

            {it.done && completedDate && (
              <div className="flex items-center gap-1 flex-wrap">
                ✅ Completed on {formatDateDDMMYYYY(completedDate)}
                {deadline && daysDiff !== null && (
                  <span
                    className={`ml-1 font-semibold ${
                      daysDiff > 0
                        ? "text-green-400"
                        : daysDiff < 0
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {daysDiff > 0
                      ? `(${daysDiff} days before deadline)`
                      : daysDiff < 0
                      ? `(${Math.abs(daysDiff)} days after deadline)`
                      : "(on deadline day)"}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </li>

      {showDatePicker &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: pickerPosition.top,
              left: pickerPosition.left,
              zIndex: 99999,
            }}
          >
            <DatePicker
              selected={deadline ? new Date(deadline) : null}
              onChange={(date) => {
                setTaskDeadline(path, idx, date ? formatLocalISO(date) : "");
                setShowDatePicker(false);
              }}
              onClickOutside={() => setShowDatePicker(false)}
              inline
            />
          </div>,
          document.body
        )}
    </>
  );
}

// ------------------ SECTION CARD ------------------
function SectionCard({
  secKey,
  node,
  meta,
  nr,
  setNR,
  setTargetDate,
  toggleOpen,
  setAllAtPath,
  markTask,
  setTaskDeadline,
}) {
  /* ======================= SETUP ======================= */

  const sectionPath = [secKey];

  // Section meta (collapse state + target date)
  const m = meta[pathKey(sectionPath)] || {
    open: false,
    targetDate: "",
  };

  // Progress calculations
  const totals = totalsOf(node);
  const allDone = totals.total > 0 && totals.done === totals.total;

  /* ======================= HOUR ROLLUP ======================= */
  const hoursRollup = useMemo(() => {
    if (!Array.isArray(node)) {
      let est = 0;
      for (const [childKey, childVal] of Object.entries(node || {})) {
        if (Array.isArray(childVal)) {
          childVal.forEach((_, idx) => {
            const e = Number(
              nr[itemKey([secKey, childKey], idx)]?.estimate || 0.5
            );
            est += isFinite(e) ? e : 0.5;
          });
        } else {
          Object.entries(childVal || {}).forEach(([gk, gv]) => {
            if (Array.isArray(gv)) {
              gv.forEach((_, idx) => {
                const e = Number(
                  nr[itemKey([secKey, childKey, gk], idx)]?.estimate || 0.5
                );
                est += isFinite(e) ? e : 0.5;
              });
            }
          });
        }
      }
      return est;
    }

    return node.reduce((s, _, idx) => {
      const e = Number(nr[itemKey([secKey], idx)]?.estimate || 0.5);
      return s + (isFinite(e) ? e : 0.5);
    }, 0);
  }, [node, nr, secKey]);

  // Date input ref and portal state
  const sectionDateRef = useRef(null);
  const buttonRef = useRef(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });

  // Collapse animation height
  const wrapRef = useRef(null);
  const [maxH, setMaxH] = useState(0);

  /* ======================= HEIGHT ANIMATION ======================= */

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => setMaxH(m.open ? el.scrollHeight : 0);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => ro.disconnect();
  }, [m.open, node, meta, nr]);

  /* ======================= CLOSE PICKER ON OUTSIDE CLICK ======================= */
  useEffect(() => {
    if (!showDatePicker) return;

    const handleClickOutside = (e) => {
      if (
        sectionDateRef.current &&
        !sectionDateRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDatePicker]);

  return (
    <>
      <section
        className="
          rounded-xl
          border border-[#1c5b44]/40
          dark:border-[#00D1FF33]
          backdrop-blur-sm
          bg-gradient-to-br 
          from-[#0F0F0F] via-[#183D3D] to-[#B82132] 
          dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
          shadow-[0_0_20px_rgba(0,0,0,0.2)]
          overflow-hidden
        "
      >
        {/* ======================= HEADER ======================= */}
        <div
          onClick={() => toggleOpen(sectionPath)}
          data-expanded={m.open}
          data-done={allDone}
          className="
            relative cursor-pointer
            border border-[#0B5134] 
            bg-gradient-to-br from-[#183D3D] to-[#B82132]
            dark:from-[#0F1622] dark:to-[#0A0F1C]
            text-[#CFE8E1]
            rounded-lg px-4 py-3
            transition-all duration-300
            hover:border-[#2F6B60]
            hover:shadow-[0_0_10px_rgba(47,107,96,0.4)]
          "
        >
          {/* ======================= PROGRESS BAR ======================= */}
          <div className="absolute top-0 left-0 right-0 mx-1 h-2 rounded-full bg-[#0E1F19] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/0 pointer-events-none" />

            <div
              className={`
                h-full transition-all duration-700 ease-out
                ${totals.pct >= 90 ? "animate-heartbeat" : ""}
                ${
                  totals.pct < 25
                    ? "bg-gradient-to-r from-[#0F766E] to-[#22C55E] shadow-[0_0_8px_#0F766E]"
                    : totals.pct < 50
                    ? "bg-gradient-to-r from-[#22C55E] to-[#4ADE80] shadow-[0_0_8px_#4ADE80]"
                    : totals.pct < 75
                    ? "bg-gradient-to-r from-[#4ADE80] to-[#A7F3D0] shadow-[0_0_8px_#A7F3D0]"
                    : "bg-gradient-to-r from-[#7A1D2B] to-[#EF4444] shadow-[0_0_10px_#EF4444]"
                }
              `}
              style={{
                width: `${totals.pct}%`,
                minWidth: totals.pct > 0 ? "6px" : "6px",
              }}
            >
              <div className="absolute inset-0 bg-stripes animate-stripes pointer-events-none" />
              <div className="absolute inset-0 bg-wave animate-wave pointer-events-none opacity-40" />
            </div>
          </div>

          {/* ======================= TITLE + CONTROLS ======================= */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-2">
            <div className="flex items-start gap-2 min-w-0">
              <span className="text-lg select-none shrink-0">
                {m.open ? "🔽" : "▶️"}
              </span>
              <span className="font-semibold text-base sm:text-lg leading-snug break-words">
                {secKey}
              </span>
            </div>

            <div
              className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="shrink-0">
                {totals.done}/{totals.total} • {totals.pct}% • ~
                {hoursRollup.toFixed(1)}h
              </span>

              <button
                onClick={() => setAllAtPath(sectionPath, !allDone)}
                className="
                  px-2 py-1 rounded-md border
                  border-[#00d1b2]/50 bg-[#051C14]
                  text-xs font-medium
                  hover:bg-[#07261b]
                  transition-colors shrink-0
                "
              >
                {allDone ? "Undo all" : "Mark all"}
              </button>

              {/* Deadline Picker Button */}
              <button
                ref={buttonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!showDatePicker && buttonRef.current) {
                    const rect = buttonRef.current.getBoundingClientRect();
                    const calendarWidth = 240;

                    let left = rect.left + window.scrollX;
                    let top = rect.bottom + window.scrollY + 5;

                    if (left + calendarWidth > window.innerWidth) {
                      left = window.innerWidth - calendarWidth - 10;
                    }
                    if (top + 280 > window.innerHeight + window.scrollY) {
                      top = rect.top + window.scrollY - 280;
                    }

                    setPickerPosition({ top, left });
                    setShowDatePicker(true);
                  } else {
                    setShowDatePicker(false);
                  }
                }}
                className="
                  px-2 py-1 border border-[#0B5134] rounded-md
                  bg-[#051C14] text-xs
                  hover:border-[#2F6B60] transition
                  whitespace-nowrap shrink-0
                "
              >
                📅{" "}
                {m.targetDate ? formatDateDDMMYYYY(m.targetDate) : "Deadline"}
              </button>

              {/* Clear Date Button - Only show if date exists */}
              {m.targetDate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTargetDate(sectionPath, "");
                  }}
                  className="
                    px-2 py-1 border border-red-500/50 rounded-md
                    bg-red-900/20 text-xs text-red-400
                    hover:bg-red-900/40 hover:border-red-500
                    transition-colors shrink-0
                  "
                  title="Clear deadline"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ======================= EXPANDABLE CONTENT ======================= */}
        <div
          style={{
            maxHeight: `${maxH}px`,
            transition: "max-height 420ms ease",
          }}
          className="overflow-hidden"
        >
          <div ref={wrapRef} className="px-4 pb-4 pt-2 space-y-2">
            {Object.entries(node || {}).map(([name, child]) => (
              <SubNode
                key={name}
                name={name}
                node={child}
                path={[secKey, name]}
                meta={meta}
                nr={nr}
                setNR={setNR}
                toggleOpen={toggleOpen}
                setTargetDate={setTargetDate}
                setAllAtPath={setAllAtPath}
                markTask={markTask}
                setTaskDeadline={setTaskDeadline}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ======================= COMPACT THEME-ADAPTIVE DATEPICKER ======================= */}
      {showDatePicker &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: `${pickerPosition.top}px`,
              left: `${pickerPosition.left}px`,
              zIndex: 99999,
            }}
          >
            <div
              className="
                rounded-lg p-1.5 shadow-xl border transition-all
                w-[240px] max-w-[90vw]
                bg-white dark:bg-[#0F1622]
                border-gray-300 dark:border-[#2F6B60]
                shadow-black/20 dark:shadow-black/60
              "
              style={{
                fontSize: "13px",
              }}
            >
              <DatePicker
                selected={m.targetDate ? new Date(m.targetDate) : null}
                onChange={(date) => {
                  const formatted = date ? formatLocalISO(date) : "";
                  setTargetDate(sectionPath, formatted);
                  setShowDatePicker(false);
                }}
                onClickOutside={() => setShowDatePicker(false)}
                inline
                calendarClassName="compact-datepicker"
                renderCustomHeader={({
                  date,
                  decreaseMonth,
                  increaseMonth,
                }) => (
                  <div
                    className="
                      flex items-center justify-between 
                      px-2 py-1.5 rounded-t-lg mb-1
                      bg-gray-100 dark:bg-[#0B5134]
                    "
                  >
                    <button
                      onClick={decreaseMonth}
                      className="
                        transition p-0.5 text-lg font-bold
                        text-gray-700 dark:text-[#CFE8E1]
                        hover:text-blue-600 dark:hover:text-[#00d1b2]
                      "
                    >
                      ‹
                    </button>
                    <span
                      className="
                        font-semibold text-sm
                        text-gray-900 dark:text-[#CFE8E1]
                      "
                    >
                      {date.toLocaleString("default", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={increaseMonth}
                      className="
                        transition p-0.5 text-lg font-bold
                        text-gray-700 dark:text-[#CFE8E1]
                        hover:text-blue-600 dark:hover:text-[#00d1b2]
                      "
                    >
                      ›
                    </button>
                  </div>
                )}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

// ------------------ SUB NODE (SECTION or TASK LIST) ------------------//
function SubNode({
  name,
  node,
  path,
  meta,
  nr,
  setNR,
  toggleOpen,
  setTargetDate,
  setAllAtPath,
  markTask,
  setTaskDeadline,
}) {
  /* ======================= META ======================= */
  const k = pathKey(path);
  const m = meta[k] || { open: false, targetDate: "" };

  /* ======================= STATS ======================= */
  const totals = totalsOf(node);
  const allDone = totals.total > 0 && totals.done === totals.total;

  /* ======================= COLLAPSE ANIMATION ======================= */
  const contentRef = useRef(null);
  const buttonRef = useRef(null);
  const [height, setHeight] = useState("0px");

  /* ======================= DATE PICKER ======================= */
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (m.open && contentRef.current) {
      setHeight(contentRef.current.scrollHeight + "px");
    } else {
      setHeight("0px");
    }
  }, [m.open, node, nr]);

  useEffect(() => {
    if (!showDatePicker || !buttonRef.current) return;

    const updatePosition = () => {
      const rect = buttonRef.current.getBoundingClientRect();
      const calendarWidth = 240;

      let left = rect.left + window.scrollX;
      let top = rect.bottom + window.scrollY + 5;

      if (left + calendarWidth > window.innerWidth)
        left = window.innerWidth - calendarWidth - 10;
      if (top + 280 > window.innerHeight + window.scrollY)
        top = rect.top + window.scrollY - 280;

      setPickerPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("orientationchange", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("orientationchange", updatePosition);
    };
  }, [showDatePicker]);

  /* ======================= HOUR ROLLUP ======================= */
  const hoursRollup = useMemo(() => {
    if (!Array.isArray(node)) {
      let est = 0;

      for (const [childKey, childVal] of Object.entries(node || {})) {
        if (Array.isArray(childVal)) {
          childVal.forEach((_, idx) => {
            const e = Number(
              nr[itemKey([...path, childKey], idx)]?.estimate ?? 0.5
            );
            est += isFinite(e) ? e : 0.5;
          });
        } else {
          for (const [gk, gv] of Object.entries(childVal || {})) {
            if (Array.isArray(gv)) {
              gv.forEach((_, idx) => {
                const e = Number(
                  nr[itemKey([...path, childKey, gk], idx)]?.estimate ?? 0.5
                );
                est += isFinite(e) ? e : 0.5;
              });
            }
          }
        }
      }
      return est;
    }

    // Leaf list
    return node.reduce((sum, _, idx) => {
      const e = Number(nr[itemKey(path, idx)]?.estimate ?? 0.5);
      return sum + (isFinite(e) ? e : 0.5);
    }, 0);
  }, [node, nr, path]);

  // ======================= DEADLINE STATUS =======================

  const deadlineStatus = useMemo(() => {
    if (!m.targetDate) return null;
    if (!Array.isArray(node)) return null;

    // collect completed dates
    const completedDates = node
      .map((it, idx) => {
        const key = itemKey(path, idx);
        return it.done ? nr[key]?.completedDate || it.completedOn : null;
      })
      .filter(Boolean);

    if (completedDates.length < node.length) {
      return { type: "progress", label: "⏳ In progress" };
    }

    const deadline = new Date(m.targetDate);
    const latestCompletion = new Date(
      completedDates.sort((a, b) => new Date(b) - new Date(a))[0]
    );

    if (latestCompletion <= deadline) {
      return {
        type: "ontime",
        label: `✅ Completed on time (${formatDateDDMMYYYY(
          latestCompletion.toISOString().slice(0, 10)
        )})`,
      };
    }

    return {
      type: "late",
      label: `⚠️ Completed late (${formatDateDDMMYYYY(
        latestCompletion.toISOString().slice(0, 10)
      )})`,
    };
  }, [node, nr, m.targetDate, path]);

  /* ======================= UI ======================= */
  return (
    <>
      <div className="rounded-xl border border-[#0B5134]/35 bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] text-[#d9ebe5]">
        {/* HEADER */}
        <div
          onClick={() => toggleOpen(path)}
          className="group p-3 cursor-pointer bg-gradient-to-r from-[#134039] to-[#0f362f] hover:from-[#165247] hover:to-[#134039] border-l-4 border-[#D42916] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
            {/* Left section: Icon + Title + Badge */}
            <div className="flex items-center gap-2.5 flex-1 min-w-fit">
              <span className="text-base transition-transform group-hover:scale-110">
                {m.open ? "🔽" : "▶️"}
              </span>
              <span className="font-medium text-sm sm:text-[15px] text-gray-100">
                {name}
              </span>
              {m.targetDate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTargetDate(path, "");
                  }}
                  className="px-2 sm:hidden py-1 border border-red-500/50 hover:border-red-500 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Right section: Stats + Actions */}
            <div
              onClick={(e) => e.stopPropagagation()}
              className="flex items-center gap-2 sm:gap-2.5 flex-wrap w-full sm:w-auto"
            >
              {/* Stats with enhanced visibility */}
              <div className="px-2 sm:px-2.5 py-1 bg-black/20 rounded-md border border-gray-700/30">
                <span className="text-[11px] sm:text-xs font-medium text-gray-300 whitespace-nowrap">
                  {totals.done}/{totals.total} • {totals.pct}% •{" "}
                  {totals.total ? "≈" : ""}
                  {hoursRollup?.toFixed?.(1) ?? ""}h
                </span>
              </div>
              {/* Vertical divider - hidden on mobile */}
              <div className="hidden sm:block h-5 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
              {/* Action buttons */}
              <button
                onClick={() => setAllAtPath(path, !allDone)}
                className="px-2.5 sm:px-3 py-1.5 border border-[#00d1b2]/50 hover:border-[#00d1b2] rounded-lg bg-[#00d1b2]/5 hover:bg-[#00d1b2]/15 text-[#00d1b2] font-medium text-[11px] sm:text-xs transition-all duration-200 hover:shadow-md hover:shadow-[#00d1b2]/20 whitespace-nowrap"
              >
                {allDone ? "Undo all" : "Mark all"}
              </button>
              <button
                ref={buttonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDatePicker((v) => !v);
                }}
                className="px-2.5 sm:px-3 py-1.5 border border-[#0B5134] hover:border-[#0d6847] rounded-lg bg-[#051C14] hover:bg-[#072920] transition-all duration-200 text-[11px] sm:text-xs font-medium whitespace-nowrap hover:shadow-md"
              >
                📅{" "}
                {m.targetDate ? formatDateDDMMYYYY(m.targetDate) : "Deadline"}
              </button>
              {m.targetDate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTargetDate(path, "");
                  }}
                  className="px-2 hidden sm:block py-1 border border-red-500/50 hover:border-red-500 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          {deadlineStatus && (
            <div
              className={`text-[10px] font-bold px-2 sm:px-2.5 py-1 rounded-full w-fit sm:mt-0 mt-2 whitespace-nowrap shadow-sm ${
                deadlineStatus.type === "ontime"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 ring-1 ring-emerald-500/20"
                  : deadlineStatus.type === "late"
                  ? "bg-red-500/20 text-red-300 border border-red-500/50 ring-1 ring-red-500/20"
                  : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 ring-1 ring-yellow-500/20"
              }`}
            >
              {deadlineStatus.label}
            </div>
          )}
        </div>

        {/* BODY */}
        <div
          ref={contentRef}
          style={{ maxHeight: height }}
          className="transition-all overflow-hidden"
        >
          <div className="px-3 pb-3">
            {Array.isArray(node) ? (
              <ul className="space-y-2">
                {node.map((it, idx) => (
                  <TaskItem
                    key={idx}
                    it={it}
                    idx={idx}
                    path={path}
                    nr={nr}
                    setNR={setNR}
                    markTask={markTask}
                    setTaskDeadline={setTaskDeadline}
                  />
                ))}
              </ul>
            ) : (
              <div className="space-y-2">
                {Object.entries(node || {}).map(([childKey, childVal]) => (
                  <SubNode
                    key={childKey}
                    name={childKey}
                    node={childVal}
                    path={[...path, childKey]}
                    meta={meta}
                    nr={nr}
                    setNR={setNR}
                    toggleOpen={toggleOpen}
                    setTargetDate={setTargetDate}
                    setAllAtPath={setAllAtPath}
                    markTask={markTask}
                    setTaskDeadline={setTaskDeadline}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showDatePicker &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: pickerPosition.top,
              left: pickerPosition.left,
              zIndex: 99999,
            }}
          >
            <DatePicker
              selected={m.targetDate ? new Date(m.targetDate) : null}
              onChange={(date) => {
                setTargetDate(path, date ? formatLocalISO(date) : "");
                setShowDatePicker(false);
              }}
              onClickOutside={() => setShowDatePicker(false)}
              inline
            />
          </div>,
          document.body
        )}
    </>
  );
}

/******************** DAILY AUTO PLANNER ********************/

function DailyPlanner({ tree, nr }) {
  // ✅ SAFETY GUARD (no UI change)
  if (!tree) return null;

  const tasks = [];

  function walk(node, path) {
    if (Array.isArray(node)) {
      node.forEach((it, idx) => {
        const key = itemKey(path, idx);
        const deadline = nr?.[key]?.deadline || "";
        const done = it.done;

        tasks.push({
          title: it.title,
          key,
          done,
          deadline,
          hasDeadline: Boolean(deadline),
          d: deadline ? Date.parse(deadline) : Infinity,
        });
      });
      return;
    }

    for (const [k, v] of Object.entries(node || {})) {
      walk(v, [...path, k]);
    }
  }

  walk(tree, []);

  /** -------------------------------
   *   FINAL LOGIC (UNCHANGED)
   * ------------------------------- */

  const uncompleted = tasks.filter((t) => !t.done);

  if (uncompleted.length === 0) {
    return (
      <div className="w-full text-center py-10 sm:py-12 px-4">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="text-lg font-semibold text-emerald-100">All Clear!</h3>
        <p className="text-gray-400 text-sm">Everything is complete</p>
      </div>
    );
  }

  const withDeadlines = uncompleted
    .filter((t) => t.hasDeadline)
    .sort((a, b) => a.d - b.d)
    .slice(0, 6);

  const toShow =
    withDeadlines.length > 0 ? withDeadlines : uncompleted.slice(0, 6);

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm opacity-80 mb-3">
          Closest-deadline topics not yet done.
        </p>

        <div className="flex items-center gap-1.5">
          <span className="text-lg">🎯</span>
          <div>
            <p className="text-sm font-bold text-emerald-300">
              {toShow.length} {toShow.length === 1 ? "Task" : "Tasks"}
            </p>
            <p className="text-[9px] text-gray-400">Sorted by deadline</p>
          </div>
        </div>
      </div>

      <ul className="space-y-1.5">
        {toShow.map((item) => {
          const deadline = item.deadline ? new Date(item.deadline) : null;
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          let urgencyIcon = "📅";
          let urgencyBadge =
            "bg-emerald-900/30 text-emerald-300 border-emerald-700/40";
          let cardBg = "from-[#0B5134]/10 to-black/20";
          let borderColor = "border-emerald-700/30";
          let glowColor = "shadow-emerald-900/0";
          let progressColor = "bg-emerald-500";
          let daysLeft = null;

          if (deadline) {
            const diff = deadline - today;
            const daysRemaining = Math.ceil(diff / (24 * 60 * 60 * 1000));

            if (diff < 0) {
              urgencyIcon = "⏰";
              urgencyBadge = "bg-red-900/40 text-red-300 border-red-600/50";
              cardBg = "from-red-950/20 to-black/30";
              borderColor = "border-red-700/40";
              glowColor = "shadow-red-900/20";
              progressColor = "bg-red-500";
              daysLeft = `${Math.abs(daysRemaining)}d late`;
            } else if (diff === 0) {
              urgencyIcon = "⚡";
              urgencyBadge =
                "bg-yellow-900/40 text-yellow-300 border-yellow-600/50";
              cardBg = "from-yellow-950/20 to-black/30";
              borderColor = "border-yellow-700/40";
              glowColor = "shadow-yellow-900/30";
              progressColor = "bg-yellow-500";
              daysLeft = "Today";
            } else if (diff < 3 * 24 * 60 * 60 * 1000) {
              urgencyIcon = "⏰";
              urgencyBadge =
                "bg-orange-900/40 text-orange-300 border-orange-600/50";
              cardBg = "from-orange-950/20 to-black/30";
              borderColor = "border-orange-700/40";
              glowColor = "shadow-orange-900/20";
              progressColor = "bg-orange-500";
              daysLeft = `${daysRemaining}d left`;
            } else {
              daysLeft = `${daysRemaining}d left`;
            }
          }

          return (
            // ✅ STABLE KEY (UI unchanged)
            <li
              key={item.key}
              className={`
                group relative
                bg-gradient-to-br ${cardBg}
                hover:brightness-110
                rounded-lg
                border ${borderColor}
                overflow-hidden
                transition-all duration-200
                hover:shadow-md ${glowColor}
                cursor-pointer
              `}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-0.5 ${progressColor} opacity-60 group-hover:opacity-100 transition-opacity`}
              />

              <div className="p-2 pl-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="text-sm shrink-0">{urgencyIcon}</span>
                    <span className="text-xs text-[#d9ebe5] font-medium truncate group-hover:text-white transition-colors">
                      {item.title}
                    </span>
                  </div>

                  {deadline && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center gap-0.5 opacity-70">
                        <span className="text-[9px]">📆</span>
                        <span className="text-[9px] text-gray-300 font-medium hidden sm:inline">
                          {formatDateDDMMYYYY(item.deadline)}
                        </span>
                      </div>

                      {daysLeft && (
                        <span
                          className={`
                            text-[9px] font-bold px-1.5 py-0.5 rounded
                            border ${urgencyBadge}
                            whitespace-nowrap
                            ${
                              urgencyBadge.includes("red")
                                ? "animate-pulse"
                                : ""
                            }
                          `}
                        >
                          {daysLeft}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {deadline &&
                  daysLeft &&
                  !daysLeft.includes("late") &&
                  !daysLeft.includes("Today") &&
                  parseInt(daysLeft) < 30 && (
                    <div className="mt-1.5 ml-6">
                      <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${progressColor} rounded-full transition-all duration-500`}
                          style={{
                            width: `${(() => {
                              const daysRemaining = parseInt(daysLeft);
                              const maxDays = 30;
                              return Math.min(
                                95,
                                Math.max(
                                  5,
                                  ((maxDays - daysRemaining) / maxDays) * 100
                                )
                              );
                            })()}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </li>
          );
        })}
      </ul>

      {toShow.length === 0 && (
        <div className="text-center py-6">
          <span className="text-3xl mb-1 block">🎉</span>
          <p className="text-xs text-emerald-300 font-medium">All caught up!</p>
        </div>
      )}
    </div>
  );
}

/******************** SMART SUGGEST (AI STUDY PLANNER) ********************/
/*
  - Reads directly from live syllabus tree (Mongo-synced tree)
  - Updates when tree changes
  - Handles deadline urgency colors
  - Shows estimate + remaining time
  - Keeps your exact UI vibes, only fixed broken bits
*/

function SmartSuggest({ generateSmartPlan, tree }) {
  // ✅ SAFETY GUARD (no UI change)
  if (!tree) return null;

  const [minutes, setMinutes] = useState(120);
  const [plan, setPlan] = useState([]);
  const [remaining, setRemaining] = useState(0);
  const [summary, setSummary] = useState("");

  /* ========== Keep plan updated when syllabus changes ========== */
  useEffect(() => {
    setPlan((prev) =>
      prev.map((p) => {
        const match = findInTree(tree, p.title);
        return match ? { ...p, done: !!match.done } : p;
      })
    );
  }, [tree]);

  /* ========== Main Suggest Button Logic ========== */
  const handleSuggest = () => {
    const { plan, remaining } = generateSmartPlan(minutes);

    const sorted = [...plan].sort((a, b) => {
      const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return da - db;
    });

    let sum = "";
    if (sorted.length === 0) sum = "No urgent topics found for now! 🎉";
    else if (sorted.length <= 2)
      sum = "🧠 Focus on these key tasks today — high impact and short!";
    else if (sorted.length <= 4)
      sum = "⚡ Balanced day ahead! Let’s tackle core and conceptual topics.";
    else sum = "🚀 Power day! Deep-dive into multiple modules today.";

    setPlan(sorted);
    setRemaining(remaining);
    setSummary(sum);
  };

  /* ========== Deadline Text Helper ========== */
  function daysLeft(deadline) {
    if (!deadline) return "";

    const today = new Date();
    const d = new Date(deadline);
    const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));

    if (diff > 0) return `Due in ${diff} day${diff > 1 ? "s" : ""}`;
    if (diff === 0) return "Due today!";
    return `Overdue by ${Math.abs(diff)} day${Math.abs(diff) > 1 ? "s" : ""}`;
  }

  /* ========== Safely Find Task in Tree by Title ========== */
  function findInTree(node, title) {
    if (!node) return null;

    if (Array.isArray(node)) {
      for (const it of node) {
        if (it.title === title) return it;
      }
    } else {
      for (const [, v] of Object.entries(node || {})) {
        const found = findInTree(v, title);
        if (found) return found;
      }
    }
    return null;
  }

  /* ========== UI ========== */
  return (
    <div
      className="
        rounded-2xl border border-[#0B5134]/40
        bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] 
        dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] 
        dark:border-[#00D1FF33]
        p-5 shadow-[0_0_20px_rgba(0,0,0,0.2)]
        transition-all duration-300
        hover:shadow-[0_0_30px_rgba(255,143,143,0.15)]
      "
    >
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF8F8F] to-[#ff6f6f] dark:from-[#451013] dark:to-[#5A1418] flex items-center justify-center shadow-lg">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Smart Suggest</h3>
            <p className="text-[10px] text-gray-400">
              AI-powered study planner
            </p>
          </div>
        </div>

        <span
          className="
            text-[10px] px-3 py-1.5 rounded-full
            bg-gradient-to-r from-[#FF8F8F] to-[#ff6f6f] text-black font-bold
            dark:from-[#451013] dark:to-[#5A1418] dark:text-[#FFD1D1]
            border border-[#FF8F8F]/40 dark:border-[#FF8F8F]/30
            whitespace-nowrap
          "
        >
          ✨ AI Powered
        </span>
      </div>

      {/* ===== Input ===== */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-300 mb-2 block">
          Available Study Time
        </label>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="
                w-full px-4 py-2.5 text-sm rounded-xl border 
                bg-white/5 dark:bg-black/30
                dark:border-[#00D1FF33] 
                border-[#0B5134] outline-none text-white
              "
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              minutes
            </span>
          </div>

          <button
            onClick={handleSuggest}
            className="
              px-5 py-2.5 rounded-xl 
              bg-gradient-to-r from-[#FF8F8F] to-[#ff6f6f]
              text-black font-bold text-sm
            "
          >
            Generate ✨
          </button>
        </div>
      </div>

      {/* ===== Summary ===== */}
      {summary && (
        <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs italic text-white/80">💡 {summary}</p>
        </div>
      )}

      {/* ===== Suggestions ===== */}
      <div className="space-y-2.5">
        {plan.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-3xl">📚</span>
            <p className="text-sm text-gray-400">No suggestions yet</p>
          </div>
        ) : (
          plan.map((item) => {
            const now = new Date();
            const urgency =
              item.deadline && new Date(item.deadline) < now
                ? {
                    bg: "bg-red-500/20",
                    text: "text-red-400",
                    border: "border-red-600/50",
                    barColor: "bg-red-500",
                  }
                : item.deadline &&
                  new Date(item.deadline) - now < 1000 * 60 * 60 * 24 * 2
                ? {
                    bg: "bg-yellow-500/20",
                    text: "text-yellow-300",
                    border: "border-yellow-600/50",
                    barColor: "bg-yellow-500",
                  }
                : {
                    bg: "bg-emerald-500/20",
                    text: "text-emerald-400",
                    border: "border-emerald-600/50",
                    barColor: "bg-emerald-500",
                  };

            const countdown = daysLeft(item.deadline);

            return (
              <div
                key={`${item.title}-${item.deadline || "no-deadline"}`} // ✅ stable key
                className={`
                  group relative rounded-xl border p-3 text-sm
                  transition-all duration-300
                  ${item.done ? "opacity-50 line-through" : "bg-white/5"}
                  ${urgency.border}
                `}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${urgency.barColor}`}
                />

                <div className="pl-3">
                  <div className="font-semibold text-[#d9ebe5]">
                    📖 {item.title}
                  </div>

                  {countdown && (
                    <span
                      className={`
                        text-[10px] font-bold px-2 py-1 rounded
                        ${urgency.bg} ${urgency.text} border ${urgency.border}
                      `}
                    >
                      {countdown}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ===== Footer ===== */}
      <div className="mt-5 pt-4 border-t border-[#0B5134]/60 text-xs text-white/70">
        {plan.length > 0
          ? `Buffer remaining: ${remaining} mins`
          : "Ready to plan your study session"}
      </div>
    </div>
  );
}
