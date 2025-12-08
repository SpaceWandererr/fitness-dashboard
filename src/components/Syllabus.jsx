import { useEffect, useMemo, useRef, useState, useCallback } from "react";

const API_URL = "https://fitness-backend-laoe.onrender.com/api/state";
const LOCAL_KEY = "wd_dashboard_state";

/* ======= FULL embedded syllabus tree (auto-parsed + Aptitude fixed) ======= */
const TREE = {
  "Episode 1 - Code": {
    "1. How the Internet Works:": [
      {
        title: "History of Web (Web 1.0 to Web 3.0).",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "How computer communicate with each other.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "How computer send data all over the world.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "What is Domain Name, IP & MAC Addresses and Routing.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "How ISP and DNS work together to deliver data.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "2. Client-Server Architecture:": [
      {
        title: "What is Client-Server Model.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Difference between Client (browser) and Server (the computer hosting your website).",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "How HTTP request and response cycle works (how browser talk to server).",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "What happens when you visit a website.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Difference between Front-end and Back-end (Front-end vs Back-end).",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "What are Static Websites and Dynamic Websites.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "What is web hosting and how it works.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "3. Internet Protocols:": [
      {
        title: "What is TCP protocol and why is widely used",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "How Connection is established using TCP (3 Way handshake)",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "What is UDP and why its used for fast communication",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "How UPD establishes connection",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Difference between TCP and UPD",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "4. Understanding HTTP and HTTPS": [
      {
        title: "What is HTTP and its different version",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "HTTP status code for responses",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "What is HTTPS and why its better than HTTP",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "How HTTPS provides a secure connection",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "What is SSL/TLS Encryption",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "What are Proxy and Reverse Proxy",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "How VPN works and helps accessing restricted content",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "5. Preparing Your Machine": [
      {
        title: "Installing & Setting up VS Code",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Installing helpful extensions",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Setting up your browser for development",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "What are file and folders and how to create them",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Testing our environment via serving a webpage - “ Namaste Duniya ”",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
  },
  "Episode 2 - Stage": {
    "1. Starting with HTML": [
      {
        title: "Understanding HTML and its use Cases.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Creating first HTML page in VS Code",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understand HTML Structure",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Understanding Tags and building simple HTML page - doctype , html , head , title , body",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Working with text elements - h tags , p tag , br tag , a tag , span , code , pre",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Working with HTML Lists(Ordered & Unordered lists) - ol , ul , li",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding Concept of nested elements in HTML",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Working with Media Tags - img , video , audio",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "HTML attributes - href , target , alt , src , width , height ,",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Navigating between pages",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "2. More on HTML": [
      {
        title:
          "Understanding semantic tags - article , section , main , aside , form , footer , header , details , figure",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Differentiating between block and inline elements",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Text formatting tags in HTML - b , string , i , small , ins , sub , sup , del , mark",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Working with HTML tables - table , td , tr , th",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "3. HTML Forms and Inputs": [
      {
        title: "What is Form and why its important",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Creating a simple Form with tags - form , input , textarea , select , button , label",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Types of input fields - checkbox , text , color , file , tel , date , number , radio , submit , range",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Attributes of Form Elements - method , actions , target , novalidate , enctype , name , required, placeholder",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "4. Media Tags in HTML": [
      {
        title: "Understanding with audio and video Tags",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Attributes if media tags - src , width , height , alt , muted , loop , autoplay , controls , media",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Using source element for alternative media files",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "5. Basics of CSS": [
      {
        title: "Introduction to CSS and Why it is important",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding Syntax, Selectors and comments in CSS",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Adding CSS to HTML Page - Inline , Internal , External",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Understanding difference between selectors - class , id , element",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding precedence of selectors",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "How to style text using CSS - font family , font style , font weight , line-height , text-decoration , text-align , text-transform , letter-spacing , word-spacing , text-shadow",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "6. Styling With CSS": [
      {
        title: "Working with colors in CSS - name , rgb , etc.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Working with css units - % , px , rem , em , vw , vh , min , max",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Working with borders and border styling",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Working with box properties - margin , padding , box-sizing , height , width",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Understanding Background properties - background-size , background-attachment , background-image , background-repeat , background-position , linear-gradient",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Implementing shadow-[0_0_20px_rgba(0,0,0,0.2)] property.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "7. More about CSS": [
      {
        title:
          "Applying display properties - inline , grid , flex , none , inline-block , etc.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Introduction to FlexBox for aligning and structure - flex-direction , order , flex-wrap , flex-grow , flex-shrink , justify-content , align-items , align-content , align-self , flex-basis , shorthand properties of flex",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding Flex Grid for making grids using CSS.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Working with positional properties - absolute , relative , static , sticky , fixed .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding Overflow - visible , hidden , scroll.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Working with Grouping Selectors.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Why we use Nested Selectors.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "8. Interesting things about CSS ✌️": [
      {
        title:
          "Applying pseudo classes and Pseudo Elements [ hover , focus , after , before , active ] .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Learning CSS Transitions ( properties , duration , timing functions , delays ).",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Creating with Transform ( translate , rotate , scale , skew , transform , rotate ).",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Working with 3D Transform ( translate3d() , translateZ() , scale3d() , scaleZ() , rotate3d() , rotateZ() .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding CSS Animation ( @keyframes ).",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "9. Responsive with CSS 🖥️": [
      {
        title:
          "Difference Between Mobile-first and Desktop first Website(mobile-first vs desktop first).",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Measurement units for Responsive Design - px(pixel) , in(inch), mm(millimetre) , % , rem",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Using Viewport meta element for Responsive.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Setting up Images and Typography for Responsiveness.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "What are Media queries [ @media , max-width , min-width ].",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Using Different function of CSS [ clamp , max , min ].",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understand HTML structure for Responsive Design.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "10 Working With SASS (SASSY) my favorite 🤩": [
      {
        title:
          "What is SASS? Variables , Nesting , Mixins , Functions and Operators .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Setting up environment for SCSS .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "SCSS or SASS? and Setting Up SCSS .",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "11. Basics of Javascript with ES6+ Features 🚀": [
      {
        title:
          "Introduction to JavaScript, Why it is Important! and What can it do for you?",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "How to link javascript files using script-tag .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Running JavaScript in the Browser Console .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Variables and Keywords in Javascript [ var , let , const ].",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Logging with javascript - [ console.log() , console.info() , console.warn() , prompt , alert ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Working with String in JS and there -[ splice , slice , template string , split , replace , includes ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "What are Statement and Semicolons in JS",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "How to add Comments in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "What are Expression in Js and difference between expression and statement",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "JavaScript Data Types - [ float , number , string , boolean , null , array , object , Symbol , Undefined ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Some Important Values - [ undefined , null , NaN , Infinity ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Relative and Primitive Data Type in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Basic Operators(Arithmetic, Assignment, Increment, Decrement, Comparison, Logical, Bitwise) - [ + , , , / , ++ , - , == , === , != , and more ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Variable hoisting in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "12 . Loops and Conditionals in Javascript": [
      {
        title:
          "Understanding Condition Operator in Javascript - [ if , else , if-else , else-if , Ternary Operator , switch ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "for Loop in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "while Loop in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "do...while in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "forEach in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "for in Loop in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "for of Loop in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Recursion in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Loop control statements - [ break , continue ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "13. Functions in JavaScript": [
      {
        title:
          "Understanding Function in JavaScript and why its widely used - [ parameters , arguments , rest parameters , hoisting , Variable Hoisting , Function Hoisting ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Parameters in JavaScript - [ required , destructured , rest , default ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Arguments in JavaScript - [ positional , default , spread ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Classic Function , Nested Function (function within function), Scope Chain in Javascript.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding Immediately Invoked Function Expression(IIFE).",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "More Functions in JavaScript - [ Arrow Function , Fat Arrow , Anonymous , Higher Order , Callback , First Class , Pure Function , Impure Function ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Understanding Scoping in JS - [ Global scope , Function scope ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding Closures , Scoping Rule .",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "14. Arrays and Objects in JavaScript": [
      {
        title: "What are Arrays in JavaScript and how to Create an Array.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understand How to Accessing Elements in Array.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Functions on Arrays - [ push , pop , shift , unshift , indexOf , array destructuring , filter , some , map , reduce , spread operator , slice , reverse , sort , join , toString ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Iterating Over Arrays using - [ For Loop , forEach ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Understanding What are Objects in JavaScript - [ key-value pair ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Creating Objects, Accessing Properties, Deleting Property and Nested Objects.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Recognise How Objects Are Stored, Traverse Keys of an Object, Array as Object.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Timing Events - setTimeout() , setInterval() , clearTimeout() , clearInterval()",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Operation in Objects - [ freeze , seal , destructuring , object methods , this keyword ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "15. Document Object Model Manipulation": [
      {
        title: "Introduction to DOM in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Understanding DOM Structure and Tree - [ nodes , elements , document ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Fetching Elements in DOM - [ document.getElementById , document.getElementsByTagName , document.getElementsByClassName, document.querySelectorAll , document.querySelector ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "DOM Tree Traversal - [ parentNode , childNodes , firstChild , nextSibling ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Manipulating DOM Element in JavaScript - [ innerHTML , textContent , setAttribute , getAttribute , style property , classList ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Create and Removing DOM Elements - [ createElement() , appendChild() , insertBefore() , removeChild() ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "16. Event Handeling in JavaScript": [
      {
        title:
          "Event Handling in JavaScript - [ addEventListner() , event bubbling , event.target ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Understanding Scroll Events, Mouse Events, Key Events and Strict Mode.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Working with Forms and Input Elements [ Accessing Form Data , Validating Forms , preventDefault() , onsubmit , onchange ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Working with Classes ****Adding, Removing , Toggling (classList methods)",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Browser Events - [ DOMContentLoaded , load , resize , scroll ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "17. Using Browser Functionalities in JavaScript": [
      {
        title:
          "Browser Object Model - [ window , navigator , history , location , document ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Window Object - [ window.location , window.history ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Working with Storage - [ Local Storage , Session Storage , Cookies ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Web APIs in DOM - [ Fetch API ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "18. Object Oriented Concepts in JavaScripts": [
      {
        title: "Introduction to OOPS in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding classes and objects in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Understanding Constructor and Prototypes - [ this keyword , call , apply , bind ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "More Topics in OOPS - [ class expression , hoisting , inheritence , getter & setter ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "19.AsynchronousProgramming JavaScript": [
      {
        title: "Introduction to Asynchrony in JavaScript.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Introduction to callbacks and Problems in Callbacks",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding promises - pending , resolved , rejected",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "How to prevent callback hell using async & await .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "setInterval & setTimeout in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "20. Error Handling in JavaScript": [
      {
        title: "Introduction to Error Handling",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Common types of errors in JavaScript - [ Syntax errors , Runtime errors , Logical errors ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding the Error object - [ message , name , stack ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Handling exceptions using try-catch , try-catch-finally",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "How to Throw Errors in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "How to create custom error in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Error Handling in Asynchronous Code",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "21. Kuch Baatein Advance JavaScript Pr ⚙️": [
      {
        title: "Throttling and Debouncing uses in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "JSON Handeling and JavaScript - [ JSON.parse() , JSON.stringify() ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "22. Git and Github": [
      {
        title: "What is Git and Github?",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Concepts - Git commits , Understanding branches , Making branches , merging branches , conflict in branches , understanding workflow , pushing to GitHub .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "How to use GitHub with team members, forking, PR(pull requests) open source contribution, workflow with large teams.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
  },
  "Episode 3 - Commit": {
    "1. Introduction of React 🪫": [
      {
        title: "What is React, and Why Use It?",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "What are Components and types of Components - class component , function components",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Understanding Single Page Applications (SPAs), Single Page Applications Vs Multi-Page Applications.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Difference between Real DOM and Virtual DOM",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "NPM Basics | Installing Packages .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "How does updates work in React? and More ES6+ features like Import & Exports ,",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Difference Between React and Other Frameworks ( Angular , Vue ).",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Learning Some Basic Terminal Commands - pwd , ls , cd , clear",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Setting Up React Environment with nodejs .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Install React-Vite Boilerplate and Installing React Developer Tools.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Understanding JSX or JavaScript XML and Its Importance - Fragments , Components Naming .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Creating and Understanding best practices for Components in React.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "2. Styling in React 🐼": [
      {
        title: "Different Styling Approaches.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Importance of component-based styling. Inline Styles , CSS Modules",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Dynamic Styling Based on Props or State.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Responsive Design in React",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Media queries with CSS and styled-components.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "3. Animations 🔥": [
      {
        title:
          "Animation and Transitions Using libraries like framer-motion or gsap for advanced animations.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "3. React Basics 🔦": [
      {
        title: "Create Components with functions .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Importing css file/stylesheet in react and Adding a CSS Modules Stylesheet - Styled Components , Dynamic styling with styled-components .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Creating a state and Manage State using setState - What is State? , setState , useState .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Creating Parameterised Function Components in React.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "React Props : Passing Data to Components.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Function chaining in React and Conditional Rendering - Rendering Array Data via map , Eliminating Array Data via filter .",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "4. More on React 📽️": [
      {
        title: "Higher Order Components in React.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Reusing Components, Lists and Keys in React.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Sharing Data with child components : Props Drilling .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Rendering a List, Mapping and Component Lifecycle - Mounting , Updating , Unmounting .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding React Component Lifecycle .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Different Lifecycle Methods like componentDidMount .",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "5. Useful Hooks in React 🪝": [
      {
        title: "Understanding React Hooks",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Rules of hooks.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Commonly Used Hooks: useState useEffect useContext useRef useCallback useMemo",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "useState",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "useEffect",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "useContext",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "useRef",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "useCallback",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "useMemo",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Custom Hooks : When and How to Create Them",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding and Applying Context API .",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "6. Navigation in the React withReact Router 🚧": [
      {
        title: "Introduction to React Router.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Setting Up and Configuring React Router setup of react-router-dom .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Navigating Between Pages with .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Passing Data while Navigating",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Dynamic Routing",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "URL Parameters and Query Strings",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Nested Routes",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Programmatic Navigation Using useNavigate .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Handling 404 Pages : fallback route for unmatched paths, Customizing the “Page Not Found” experience.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "7. State Management Using Redux. 🏪": [
      {
        title:
          "Introduction to Redux , What is redux?, When and Why use redux?",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understand Principles of Redux and Redux Flow.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding State Management in React using Redux.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Why Use State Management Libraries?",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Why Redux need reducers to be pure functions .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Redux Basics: Actions , Reducers , Store , Currying , Middleware , Async Actions: Thunk",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Connecting Redux to React Components with react-redux .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Introduction to Redux Toolkit.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Alternatives: Recoil, Zustand, or MobX.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "8. Form controls in the React : Building Dynamic Forms 📋": [
      {
        title: "Introduction to Forms in React.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Building Basic Forms.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Creating form elements like input , textarea , select , etc.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Two way binding with react [ input , textarea ].",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Handling Form Events [ onChange , onSubmit , event.preventDefault() ].",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Validation in React Forms : client-side form validation.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Integrating Forms with APIs.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Sending form data to a backend using fetch or axios .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Handling loading states and success/error feedback.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "9. Performance Optimization 🏎️": [
      {
        title: "Code Splitting with React Lazy and Suspense",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Avoids redundant calculations by caching Using Memoization Techniques: React.memo useMemo useCallback",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "React.memo",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "useMemo",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "useCallback",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Avoiding Re-Renders using useState ,",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Optimizing Component Structure",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Performance Profiling Tools using Chrome DevTools , Lighthouse , Web Vitals ,Largest Contentful Paint (LCP), First Input Delay (FID)",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "10. Deploying React projects 🚨": [
      {
        title: "Preparing a React App for Production .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Building React Applications.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Environment Variables in React.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Deployment Platforms: Netlify , Vercel , GitHub Pages ,",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "11. Real-World Project with React 👷🏻‍♂️": [
      {
        title: "Building a Complete React Project",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Combining All Concepts ( Routing , State Management , API , etc.)",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Styling and Responsiveness ,",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Optimizing and Deploying the Project.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "12. Basic SEO Principles": [
      {
        title: "On-Page Optimization in SEO.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Guide to SEO Meta Tags.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Image SEO Best Practices.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Internal Link Building SEO.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Create An SEO Sitemap For a Website.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "13. Three.js and React Three-Fiber": [
      {
        title: "Understanding what is Scene .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Using 3d models for animation.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Controlling view with Orbit controls.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Applying Lights inside the scene.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding different types of Cameras .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Animating the mesh with GSAP or Framer motion .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Different types Geometries .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Using different Materials for animation.",
        done: false,
        deadline: "",
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
        deadline: "",
        completedOn: "",
      },
      {
        title: "Setting up the Tools for our Environments",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Running script with nodejs - “Namaste Duniya”",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "NPM Basics | Installing Packages .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Creating and Managing package.json .",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "2. Creating Server - Writing Our First Server 📱": [
      {
        title: "What is Server and how it works?",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Setting Up Our First Node.js Server using HTTP",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Serving A Response to the Browser and Understanding Responses.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Routing in HTTP Servers.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Understanding Status Code - 1XX , 2XX , 3XX , 404 - Not Found , 200 - success , 500 - Internal Server error , 422 - Invalid Input , 403 - the client does not have access rights to the content , etc.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Installing Nodemon for Automatic Server Restarts.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "3. Some talk on Different Architectures 🏯": [
      {
        title: "Different Architectures in backend like MVC and SOA .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding MVC Architecture Model , View , Control .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "MVC in the context of REST APIs .",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "4. Web Framework - Express.js 🚀": [
      {
        title: "what is Express.js and why to use it.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Setting Up Express Server .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Returning Response from the server.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Using Query Parameters and URL Parameters.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "HTTP Request - Some Important part of requests , Different Types of Requests - Get , Post , PUT , Patch , Delete .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Serving Static Files with express.static() .",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "5. Template Engine - EJS 🚜": [
      {
        title:
          "What is Template Engine and What is the use of Template Engine.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Template Engine Option - Handlebars , EJS , Pug , jade but We’ll use EJS .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Setting Up Template Engine - Installed EJS template engine .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Rendering Our First Page using EJS and Some important syntax - <%= %> , <% %> , <%- %> .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Loop statement, Conditional statement and Locals in views - EJS .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Accessing the Static Files Inside EJS file.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "6. Middleware in Express.js (one of my favorite) 🐵": [
      {
        title: "Understanding the middleware in express.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Implementing middleware with express.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Different types of middleware : builtIn middleware , third-party middleware , custom middleware .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Different level of middleware : Application-Level , Router-Level .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Handeling Errors and Security with middleware : Error-Handling , Helmet , CORS .",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "7. Handling file with Express 📁": [
      {
        title: "Understand Multer and its usecase?",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Uploading file with multer.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding Memory and Disk Storage.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Accessing uploaded file req.file .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Working with express.static .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Using Cloudinary or Imagekit for Real-time media processing APIs and Digital Asset Management.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "8. Beginning of Database Basics ( Bohot km theory ) 🗄️": [
      {
        title: "Relational and non-relational Databases : mongodb & mysql .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "What is MongoDB ? Why Use It?",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Installing Compass and Understand how to access DB using terminal.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Setting Up MongoDB Locally and in the Cloud .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding Datatypes Collections and Documents .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Connecting MongoDB to Node.js with Mongoose .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Database Relations - One to One , One to Many OR Many to One , Many to Many , Polymorphic .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Handling Relationships with Mongoose ( populate ).",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "9. API Development(REST) ⛓": [
      {
        title: "What is a REST API?",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Versioning in RESTful APIs - /v1/",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Using Postman for API Testing and developing - Send Requests , Save Collections , Write Tests .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Understanding and Working With Status code , 2xx (Success) , 4xx (Client Errors) , 5xx (Server Errors) .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Validating API Inputs Using libraries like express-validator or Sanitization .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Security Handling - Rate Limiting with express-rate-limit , XSS Attack , CSRF Attack , DOS Attack .",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "10. Database Optimization for Fast response 🧘🏻": [
      {
        title:
          "Indexing for Performance with MongoDB :- Single-Field Indexes , Compound Indexes , Text Indexes , Wildcard Indexes .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Best practice with Indexing explain() .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Learning MongoDB Aggregation .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Comparison Operators - [ $eq , $ne , $lt , $gt , $lte , $gte , $in , $nin ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Logical Operators - [ $not , $and , $or and $nor ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Array[ $pop , $pull , $push and $addToSet ]",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Stages in Aggregation pipeline :- $match , $group , $project , $sort , $lookup .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Creating Database on Local and Atlas",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Creating parallel pipeline with $facet .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Learning MongoDB Operators .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Understanding Different types of Operators :- Comparison , Regex , Update , Aggregation .",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "11. Logging Backend : Express.js": [
      {
        title: "Why is Logging Important?",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Setting Up Logging with Libraries winstone , Pino , Morgan .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Different mode of morgan , dev , short , tiny .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Error Handling and Logging.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "12. Production Wala Project Structure and Configuration 🗼": [
      {
        title: "Understanding the Basic Structure of application.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Learning File Naming Conventions, Git Configuration,",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Understanding Important Folders :- src/ , config/ , routes/ , utils/ .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Role of package.json , ENV and .gitignore .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Production Environment - PM2 , Error & Response Handling Configuration , CORS Configuration , async-handler.js .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Using and Configuring ESLint and Prettier for code formatting.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Testing APIs using Postman .",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "13. Authentication and Authorization 🪪": [
      {
        title: "Difference Between Authentication & Authorization",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Working with Passwords and Authentication - Cookie Authentication , OAuth Authentication",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding Session and Token Authentication.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Implementing JWT Authentication :- jsonwebtoken JWT_SECRET .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Securing user password with bcrypt hashing salt .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Role-Based Access Control ( RBAC ).",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Authenticating user with Express middleware .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding Passport.js and its usecase?",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Glancing through and Installing Passport.js",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Setting up Passport.js - passport-local , local-strategy , google-OAuth",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "express-sessions and using passport for authentication.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "14. Working Real time communication : WebSockets and socket.io 💬": [
      {
        title: "Understanding WebSockets protocol for realtime applications?",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Learning handshake , Persistent connection , Bidirectional communication , HTTP polling .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding difference between WebSocket Vs Socket.io.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Working with socket.io for realtime applications.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding usage of Rooms in Socket.io.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding Middleware in Socket.io.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "15. Working With Caching - Local and Redis 🍄": [
      {
        title: "What is Caching and How to cache data locally?",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "What is Redis ?",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Why Use Redis for Caching ?",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Implementing Redis Caching in Node.js .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Advanced Redis Features TTL , Complex Data Structures , Pub/Sub .",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "16. Error handling in express 🛑": [
      {
        title: "Basic Error Handling in Express next() .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Catching Specific Errors try & catch .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Creating Util Class for Error Handling.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "17. Testing Tools 🛠️": [
      {
        title: "Understanding Unit-Testing With Jest.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Cross Browser Testing and Why Is It Performed?",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "What Is Web Testing? and How to Test a Website.",
        done: false,
        deadline: "",
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
        deadline: "",
        completedOn: "",
      },
      {
        title: "Building an Authentication System with Generative AI .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Exploring Social Media Automation and Content Generation Projects.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Introduction to LangChain : Features and Practical Uses.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Developing Real-World Applications: AI-powered Resume Reviewer and Virtual Interview Assistant using tools like ChatGPT or Gemini .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Agentic-ai application",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Working with multi agent system",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "MCP server",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "2. Progressive Web App (PWA) Development. 🛜": [
      {
        title: "Overview of Progressive Web Apps and their benefits.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding Service Workers and their role in PWA.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Lifecycle of a Service Worker ( Install , Activate , Fetch ).",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding the Manifest File.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Creating a Manifest.json File.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Key Properties (name, short_name, icons, start_url, theme_color, background_color)",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Browser DevTools for PWA Debugging .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Implementing Lazy Loading and Code Splitting for improved performance.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Exploring various testing techniques for PWAs.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Optimizing performance with advanced caching strategies.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "3. DevOps Fundamentals - Docker 🐳": [
      {
        title:
          "Understanding DevOps and its importance in modern software development.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Learning about Continuous Integration and Continuous Deployment (CI/CD) pipelines .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Introduction to Docker and the basics of containerization .",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "4. Building Microservices with Node.js 🏘️": [
      {
        title: "What are Microservices ? Why Use Them?",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Monolithic vs Microservices Architecture.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Challenges of Microservices.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Creating a Node.js Microservice.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Designing a Microservice Architecture for a sample application.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Role of package.json in Each Microservice.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "What is Inter-Service Communication?",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Communication Patterns ( Synchronous vs Asynchronous ).",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Role of an API Gateway in Microservices.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Setting Up an API Gateway with Express.js .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Microservices and Proxying Requests .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Rate Limiting and Authentication in API Gateway.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "REST APIs for Communication",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding Message Brokers (e.g., Redis Pub/Sub ).",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Event-Driven Communication with Redis or RabbitMQ .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "OverView of Docker and Kubernetes .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Using Docker for microservice.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "5. Nextjs": [
      {
        title: "Next.js Fundamentals",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "File-based routing",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Static assets & Image optimization",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Dynamic routes ([id].js)",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Rendering & Data Fetching",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Styling in Next.js",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Deployment",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "6. Web3 Basics. ₿": [
      {
        title: "Understanding the concept and potential of Web3 .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Fundamentals of Blockchain technology and how it powers Web3.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Exploring Decentralized Applications ( DApps ) and their use cases.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Introduction to Smart Contracts : How they work and their applications.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Overview of Cryptocurrencies and their role in the Web3 ecosystem.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "7. Deployment ✈️": [
      {
        title: "We will be deploying the project on the cloud.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Easy and Smart - We’ll DigitalOcean App Platform (in-built load-balancer, scalable, containers) for Deploying our app.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Service providers give us a machine-like cloud [ AWS, GCP, Heroku, Azure ] but we’ll use AWS .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Launching Our First Machine using EC2 .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Setting up the Machine - SSH .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Pulling the code and clone the repository of the code to the main server.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Configuring the NGINX .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Masking the Domain On Our IP (We are now going to buy a new domain and Link it with cloud AWS).",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
  },
  "DSA with JavaScript": {
    "1. Conditional Statements": [
      {
        title: "Understanding Conditional Statements",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Types of Conditional Statements if , if-else , if-else if , switch",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Making decisions in a program based on inputs or variables.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Validating user data or input forms.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Creating interactive menus or options in applications.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "2. Loops, Nested Loops, Pattern Programming": [
      {
        title: "Undertsanding the use of Loops.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "for loop.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "while loop.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "do-while loop.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding the Use of Nested Loops.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Learning Pattern Programming - Pyramid patterns , right-angled triangles , and inverted triangles .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding Control Flow statement break and continue",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Learning how to set correct conditions to avoid getting stuck in infinite loops.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Understand how to optimize nested loops for better performance and reduced time complexity.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "3. Array": [
      {
        title: "Understanding the use of Arrays.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Basic Manipulations - insertion , deletion , updation",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Accessing Elements in Arrays .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Traversing Elements in Arrays .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Array Algorithms - Two Pointer Algorithm , Rotation Algorithms , Kadane’s Algorithm , etc",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "4. Object-Oriented Programming (OOP) in JavaScript": [
      {
        title: "Understanding Object-Oriented Programming",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Learn how to define a class for creating objects.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understand how to instantiate objects from a class",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Learn how the constructor() function initializes an object when it’s created.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Understand how this refers to the current object in the context.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Use this to access properties and methods within the same object.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "5. Strings in JavaScript": [
      {
        title: "Understanding Strings in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Learning String Manipulation Methods - concat() , slice() , substring() , replace() , replaceAll()",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Learning String Search and Check Operations - indexOf() , lastIndexOf() , includes() , startsWith() , endsWith()",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Learning String Transformations - toUpperCase() , toLowerCase() , trim()",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Learning String Splitting and Joining: - split() , join()",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Embed variables and expressions in strings using backticks ( )`",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Learning Escape Characters - \\n , \\t , \\’",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Algorithms on Strings - Reverse a String , Check for Palindrome , Find Longest Common Prefix , Character Frequency Count , Anagram Check",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "6. Time and Space Complexity": [
      {
        title: "Understanding Time Complexity",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding the Big-O Notation.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Constant Time – O(1)",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Logarithmic Time – O(log n)",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Linear Time – O(n)",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Linearithmic Time – O(n log n)",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Quadratic Time – O(n²)",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Exponential Time – O(2ⁿ)",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Factorial Time – O(n!)",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Key Factors That Affect Complexity - Algorithm Design , Data Structure Choice , Problem Constraints",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Tips to Reduce Time Complexity - Avoid Nested Loops , Efficient Data Structures , Optimize Recursion , Divide and Conquer",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Understanding what is Recursion and its use case",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "7. Math Problems and Algorithms": [
      {
        title: "Understanding Mathematical Operations and Their Applications",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Mathematical operations like (pow) (sqrt) and greatest common divisor (HCF) are essential in various problem-solving scenarios.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "8. Advanced Problems on Array": [
      {
        title: "Understanding Advanced Array Concepts",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Learning two-pointer approach ,",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Learning prefix sums",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Solving complex problems efficiently.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Multi-Dimensional Arrays in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Working with Multi-Dimensional Arrays",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Key Operations on Multi-Dimensional Arrays",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Algorithms Using Multi-Dimensional Arrays",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Multi-Dimensional Arrays in Real-World Scenarios",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "9. Sorting Algorithms ,Time complexity and their application": [
      {
        title: "Learning Selection Sort",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Learning Insertion Sort",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Learning Merge Sort",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Learning Quick Sort",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Learning Cyclic Sort",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "10. Binary Search and Its Algorithms": [
      {
        title: "Binary Search on Sorted Arrays",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Variations of Binary Search",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Binary Search on Infinite Arrays",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Binary Search in Rotated Sorted Array",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Binary Search on 2D Matrix",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Real-World Use Cases of Binary Search",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "11. Hashing (Set and Map) in JavaScript": [
      {
        title: "Understanding Hashing in JavaScript - s**et , map *",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Working with Set in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Methods in Set - add(value) , delete(value) , has(value) , clear() , size",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Working with Map in JavaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Methods in Map - set(key, value) , get(key) , delete(key) , has(key) , clear() , size",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Learning Algorithms Using Set & map",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "12. Linked List in JavaScript": [
      {
        title: "Understanding Linked List - Data , Pointer",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Singly Linked List.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Doubly Linked List.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Circular Linked List.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Creating a Node in Linked List:",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Building a Linked List:",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Traversing a Linked List:",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Operations on Linked Lists - Insertion , Deletion , Searching",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Algorithms Using Linked Lists",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "13. Queue in JavaScript": [
      {
        title: "Implementation of Queue by Linked List and Array",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Working with Queues - Basic Queue , Circular Queue",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Operations on Queues - Enqueue , Dequeue , Peek , IsEmpty , Size",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Algorithms Using Queues",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Applications of Queues",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "14. Stack in JavaScript": [
      {
        title: "Understanding Stacks in javaScript",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Implementation of Stack by Linked List and Array",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Working with Stacks",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Operations on Stacks - Push , Pop , Peek , IsEmpty , Size",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Algorithms Using Stacks",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Applications of Stacks",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "15. Advanced Problems on Recursion and Backtracking": [
      {
        title: "Understanding Advanced Recursion and Backtracking",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Key Problems and Algorithms like N-Queens Problem , Sudoku Solver , Subset Sum , Word Search",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Optimizing Recursive Solutions with Backtracking",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Challenges with Recursion and Backtracking",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Applications of Recursion and Backtracking",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "16. Tree": [
      {
        title: "Understanding Binary Trees",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Types of Binary Trees - Full Binary Tree , Complete Binary Tree , Perfect Binary Tree",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Key Terminology in Binary Trees - Node , Root , Leaf , Height of a Tree , Depth of a Node , Level of a Node",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Binary Tree Operations - Insertion , Deletion , Traversal , Searching",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Binary Tree Algorithms - Height , Diameter , LCA , Symmetry Check",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Applications of Binary Trees",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "17. Binary Search Tree (BST):": [
      {
        title: "Understanding Binary Search Tree",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Properties of Binary Search Tree",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "BST Operations -",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Binary Search Tree Algorithms",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Applications of Binary Search Tree",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Advantages of Binary Search Tree",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
  },
  "Aptitude and Reasoning": {
    "Classic Chapters › 1. Percentage": [
      {
        title: "Learn tips and tricks for percentages.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Solve basic, medium, and advanced questions.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs to master percentages.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "Classic Chapters › 2. Profit and Loss": [
      {
        title: "Concepts of Profit and loss",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Relationship between cost price, selling price, and mark-up price.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Solve practical scenarios involving discounts, successive transactions.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Sharpen your skills with MCQs to prepare for competitive exams.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "Classic Chapters › 3. Simple Interest": [
      {
        title: "Master the formula for calculating simple interest.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Differentiate between principal, interest rate, and time period.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Solve case-based problems related to borrowing and lending.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs for thorough preparation",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "Classic Chapters › 4. Compound Interest": [
      {
        title: "Understand the growth of investments and savings.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Differentiate between simple interest and compound interest.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Solve problems with annual, semi-annual, and quarterly compounding.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs for preparation.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "Classic Chapters › 5. Ratio and Proportion": [
      {
        title: "Grasp the basics of ratios.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Solve problems on proportional relationships.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Analyze scenarios involving scaling, sharing, and dividing quantities.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs for preparation.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "Number Related Topics › 1. Number System": [
      {
        title:
          "Understand the classification of natural numbers, whole numbers, integers, rational numbers, and irrational numbers.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Master divisibility rules, factors, multiples, and place value.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Practice MCQs to improve understanding and problem-solving speed.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "Number Related Topics › 2. HCF and LCM": [
      {
        title: "Learn techniques to find HCF and LCM.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Understand their applications in scheduling and resource sharing.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Solve word problems involving time, distance, and recurring patterns.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs for competitive exam preparation.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "Number Related Topics › 3. Average": [
      {
        title: "Understand averages and their significance.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Solve problems on weighted averages, missing numbers, and group data.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Apply averages in performance analysis and time management.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs to enhance speed and accuracy.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "Speed Work and Time Related Topics › 1. Work and Time": [
      {
        title:
          "Understand the relationship between work, time, and efficiency.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Solve problems involving individuals or groups working together.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Analyze scenarios like alternating work schedules and work completion rates.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs problems.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "Speed Work and Time Related Topics › 2. Pipes and Cisterns": [
      {
        title: "Understand the analogy between pipes and work-time.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Solve problems with multiple pipes working together or alternately.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Address challenges like leaks or partial closure.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs to improve your skills.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "Speed Work and Time Related Topics › 3. Speed, Distance, and Time": [
      {
        title: "Master the formula: Speed = Distance / Time.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Solve problems on relative speed, average speed, and varying speeds.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs questions.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "Speed Work and Time Related Topics › 4. Problems on Trains": [
      {
        title:
          "Calculate the time for a train to cross poles, platforms, or other trains.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Apply relative speed in train-related problems.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs questions.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "Speed Work and Time Related Topics › 5. Boats and Streams": [
      {
        title:
          "Understand the impact of stream direction (upstream, downstream) on speed.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Solve problems on relative speed and effective speed in flowing water.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Analyze scenarios like rowing competitions or river crossings.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs to test your understanding.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "Probability and Combinations › 1. Permutations and Combinations": [
      {
        title:
          "Understand the difference between permutations (arrangement) and combinations (selection).",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Learn key formulas and techniques for calculating arrangements and selections.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Solve problems with factorials, repetition, and circular permutations.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs to improve problem-solving skills.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "Probability and Combinations › 2. Probability": [
      {
        title: "Understand probability as a measure of likelihood.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Learn formulas for calculating probability in events.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs to improve proficiency.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "Progressions › 1. Arithmetic Progression (AP)": [
      {
        title: "Understand Arithmetic Progression with a constant difference.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Derive formulas for general term (an) and sum of n terms (Sn).",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Apply AP in real-life problem solving.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Solve problems on missing terms, specific terms, and sum of series.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs and concept-based questions.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "Progressions › 2. Geometric Progression (GP)": [
      {
        title: "Understand Geometric Progression with a constant ratio.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Solve problems on missing terms, specific terms, and sum of series.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "Miscellaneous Topics › 1. Calendar": [
      {
        title: "Understand days, months, leap years, and century years.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Learn Odd Days concept and calculation for day of the week.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Use key formulas to find the day for any given date.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Solve problems on repeating calendar years and calendar-based tricks.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs and scenario-based questions.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "Miscellaneous Topics › 2. Clocks": [
      {
        title:
          "Understand clock structure, minute hand, hour hand, and their movements.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Solve angle problems between clock hands.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Solve problems on overlaps, right angles, and opposite directions.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice clock puzzles and time calculation problems.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs and puzzle-based questions.",
        done: false,
        deadline: "",
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
        deadline: "",
        completedOn: "",
      },
      {
        title: "Track movements and turns (right/left) to find final position.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Solve problems with multiple directions and movement patterns.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs for speed and accuracy.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "2. Blood Relation": [
      {
        title:
          "Identify relationships like father , mother , brother , sister .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Analyze clues to trace family connections .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Solve problems with family trees and complex relationships.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs to improve deduction skills.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "3. Syllogism": [
      {
        title: "Understand logical reasoning and conclusion deduction.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Break down premises to check conclusions.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Work with All , Some , No premises.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Solve MCQs to identify valid/invalid conclusions.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "4. Arrangements": [
      {
        title: "Learn to arrange people or objects based on conditions.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Apply constraints like sitting together or specific positions.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Solve problems with multiple arrangement conditions .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs to strengthen understanding.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "5. Series": [
      {
        title: "Understand number sequences and identify next terms.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title:
          "Recognize patterns like arithmetic progressions , geometric progressions .",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Solve problems with varying series types and difficulty.",
        done: false,
        deadline: "",
        completedOn: "",
      },
      {
        title: "Practice MCQs to improve pattern recognition.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
  },
  "Verbal Reasoning": {
    "1. Sentence Ordering": [
      {
        title: "Practice MCQs to improve sentence ordering skills.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "2. Error Identification": [
      {
        title: "Practice MCQs to sharpen error spotting and correction.",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
    "3. Sentence Improvement": [
      {
        title: "Practice MCQs to improve sentence quality .",
        done: false,
        deadline: "",
        completedOn: "",
      },
    ],
  },
};

/* ======================= UTILITIES ======================= */

const isArray = Array.isArray;
const isObject = (o) => !!o && typeof o === "object" && !Array.isArray(o);

const deepClone = (o) => JSON.parse(JSON.stringify(o || {}));

const todayISO = () => new Date().toISOString().slice(0, 10);

// path → stable key string (for notes / meta)
const pathKey = (pathArr) =>
  pathArr
    .map((p) =>
      String(p)
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^\w_]/g, "")
        .toLowerCase()
    )
    .join("__");

/* ======================= MAIN COMPONENT ======================= */

export default function Syllabus({ dashboardState, setDashboardState }) {
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://fitness-backend-laoe.onrender.com/api/state";

  // Guard
  if (!dashboardState) {
    return <div className="p-6 text-white">Loading syllabus…</div>;
  }

  const totalsOf = (node, visited = new WeakSet()) => {
    if (!node || typeof node !== "object") {
      return { total: 0, done: 0, pct: 0 };
    }

    // stop circular reference
    if (visited.has(node)) {
      return { total: 0, done: 0, pct: 0 };
    }
    visited.add(node);

    // If it's an array of tasks
    if (Array.isArray(node)) {
      const total = node.length;
      const done = node.filter((task) => task.done).length;
      return {
        total,
        done,
        pct: total ? Math.round((done / total) * 100) : 0,
      };
    }

    // If it's an object
    let total = 0;
    let done = 0;

    for (const value of Object.values(node)) {
      const sub = totalsOf(value, visited);
      total += sub.total;
      done += sub.done;
    }

    return {
      total,
      done,
      pct: total ? Math.round((done / total) * 100) : 0,
    };
  };

  /* ---------- TREE (DERIVED FROM STATE) ---------- */
  const rawTree = dashboardState?.syllabus_tree_v2;

  const tree =
    rawTree && typeof rawTree === "object" && Object.keys(rawTree).length > 0
      ? rawTree
      : TREE;

  /* ---------- OTHER STATE FROM DASHBOARD ---------- */
  const notes = dashboardState?.syllabus_notes || {};
  const streakSet = new Set(dashboardState?.syllabus_streak || []);
  const lastStudied = dashboardState?.syllabus_lastStudied || "";
  const meta = dashboardState?.syllabus_meta || {};

  const [query, setQuery] = useState("");
  const [showTop, setShowTop] = useState(false);
  const [saving, setSaving] = useState(false);

  const saveTimeoutRef = useRef(null);
  // ------------------ LOAD STATE (LOCAL FIRST, THEN BACKEND) ------------------
  useEffect(() => {
    async function loadState() {
      try {
        // 1️⃣ Load from localStorage instantly (instant UI, no freeze)
        const local = localStorage.getItem("wd_dashboard_state");
        if (local) {
          console.log("⚡ Loaded from local cache");
          setDashboardState(JSON.parse(local));
        }

        // 2️⃣ Fetch updated version from backend (async)
        const res = await fetch(
          "https://fitness-backend-laoe.onrender.com/api/state"
        );

        if (res.ok) {
          const serverState = await res.json();

          console.log("🔥 Loaded from Mongo backend");

          // Update local + state only if backend contains valid data
          if (serverState && typeof serverState === "object") {
            setDashboardState(serverState);
            localStorage.setItem(
              "wd_dashboard_state",
              JSON.stringify(serverState)
            );
          }
        }
      } catch (err) {
        console.error("❌ Failed to load:", err);
      }
    }

    loadState();
  }, []);

  /* ======================= GLOBAL UPDATE (LOCAL + BACKEND) ======================= */

  const updateDashboard = useCallback(
    (updates) => {
      setDashboardState((prev) => {
        const newState = {
          ...prev,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        // local save
        try {
          window.localStorage.setItem(LOCAL_KEY, JSON.stringify(newState));
        } catch (e) {
          console.error("localStorage failed:", e);
        }

        // backend save (debounced)
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
          setSaving(true);
          fetch(API_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newState),
          })
            .catch((err) => console.error("Mongo save failed:", err))
            .finally(() => setSaving(false));
        }, 500);

        return newState;
      });
    },
    [API_URL, setDashboardState]
  );

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  /* ======================= TOGGLE TASK ======================= */

  const toggleTask = (path) => {
    const newTree = deepClone(tree);

    let ref = newTree;
    for (let i = 0; i < path.length - 1; i++) {
      ref = ref[path[i]];
    }

    const last = path[path.length - 1];
    const item = ref[last];

    item.done = !item.done;
    item.completedOn = item.done ? todayISO() : "";

    updateDashboard({
      syllabus_tree_v2: newTree,
    });
  };

  /* ======================= DEADLINE & NOTES ======================= */

  const setDeadline = useCallback(
    (path) => {
      const newTree = deepClone(tree);
      let ref = newTree;
      for (let i = 0; i < path.length - 1; i++) {
        ref = ref[path[i]];
      }
      const lastKey = path[path.length - 1];

      const current = ref[lastKey].deadline || "";
      const next = prompt(
        "Set deadline (YYYY-MM-DD). Leave empty to clear:",
        current
      );
      if (next === null) return;

      ref[lastKey].deadline = next.trim();
      treeRef.current = newTree;
      updateDashboard({ syllabus_tree_v2: newTree });
    },
    [tree, updateDashboard]
  );

  const setNote = useCallback(
    (path, text) => {
      const key = pathKey(path);
      const updated = { ...notes, [key]: text };
      updateDashboard({ syllabus_notes: updated });
    },
    [notes, updateDashboard]
  );

  /* ======================= EXPORT / IMPORT ======================= */

  const exportProgress = () => {
    const data = {
      syllabus_tree_v2: treeRef.current,
      syllabus_notes: notes,
      syllabus_streak: Array.from(streakSet),
      syllabus_lastStudied: lastStudied,
      syllabus_meta: meta,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "syllabus-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importProgress = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const updates = {
          syllabus_tree_v2: parsed.syllabus_tree_v2 || TREE,
          syllabus_notes: parsed.syllabus_notes || {},
          syllabus_streak: parsed.syllabus_streak || [],
          syllabus_lastStudied: parsed.syllabus_lastStudied || "",
          syllabus_meta: parsed.syllabus_meta || {},
        };
        treeRef.current = deepClone(updates.syllabus_tree_v2);
        updateDashboard(updates);
        alert("✅ Syllabus imported");
      } catch {
        alert("❌ Invalid file");
      }
    };
    reader.readAsText(file);
  };

  /* ======================= SEARCH FILTER ======================= */

  const filteredTree = useMemo(() => {
    if (!query.trim()) return tree;
    const q = query.toLowerCase();

    const filterNode = (node) => {
      if (Array.isArray(node)) {
        const items = node.filter((it) =>
          (it.title || "").toLowerCase().includes(q)
        );
        return items.length ? items : null;
      }
      const out = {};
      for (const [k, v] of Object.entries(node || {})) {
        const child = filterNode(v);
        if (child) out[k] = child;
      }
      return Object.keys(out).length ? out : null;
    };

    return filterNode(tree) || {};
  }, [tree, query]);

  /* ======================= SMART PLAN & DAILY URGENT ======================= */

  const generateSmartPlan = useCallback(() => {
    const leaves = [];
    const visited = new WeakSet();

    const walk = (node) => {
      if (!node || typeof node !== "object") return;
      if (visited.has(node)) return;
      visited.add(node);

      if (Array.isArray(node)) {
        node.forEach((it) => {
          if (!it.done) {
            leaves.push({
              title: it.title,
              deadline: it.deadline || "",
            });
          }
          if (typeof it === "object") walk(it);
        });
        return;
      }

      for (const v of Object.values(node)) walk(v);
    };

    walk(tree);

    return leaves;
  }, [dashboardState?.syllabus_tree_v2]);

  const urgentList = useMemo(() => {
    const items = [];
    const visited = new WeakSet();

    const walk = (node) => {
      if (!node || typeof node !== "object") return;
      if (visited.has(node)) return;
      visited.add(node);

      if (Array.isArray(node)) {
        node.forEach((it) => {
          if (!it?.done && it?.deadline) {
            items.push({ title: it.title, deadline: it.deadline });
          }
          if (typeof it === "object") walk(it);
        });
        return;
      }

      for (const v of Object.values(node)) walk(v);
    };

    walk(tree);

    return items
      .map((i) => ({
        ...i,
        d: i.deadline ? Date.parse(i.deadline) : Infinity,
      }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 6);
  }, [dashboardState?.syllabus_tree_v2]);

  const handleSmartPlanClick = () => {
    const minsStr = prompt("⏱ Available study time today (minutes)?", "60");

    if (!minsStr) return;
    const mins = Number(minsStr);

    if (!Number.isFinite(mins) || mins <= 0) {
      alert("⚠️ Enter a valid positive number.");
      return;
    }

    const list = generateSmartPlan(); // now returns array only

    if (!list.length) {
      alert("🔥 All tasks done — nothing left to schedule!");
      return;
    }

    // Rough estimate: 30 mins per task (adjust later)
    const taskDuration = 30;
    const maxTasks = Math.max(1, Math.floor(mins / taskDuration));

    const plan = list.slice(0, maxTasks);

    const lines = plan.map(
      (p, i) => `${i + 1}. ${p.title}${p.deadline ? `  ⏳(${p.deadline})` : ""}`
    );

    alert(
      `📘 Smart Study Plan\n--------------------------------\n` +
        `⏰ Study Duration: ${mins} mins\n` +
        `📌 Tasks: ${plan.length}\n\n` +
        lines.join("\n") +
        `\n\n🚀 Tip: Mark tasks done as you finish.`
    );
  };

  /* ======================= PROGRESS, STREAK, SCROLL ======================= */

  const grand = useMemo(
    () => totalsOf(tree),
    [dashboardState?.syllabus_tree_v2]
  );
  const streak = useMemo(
    () => streakSet.size,
    [dashboardState?.syllabus_streak]
  );

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  /* ======================= RENDER ======================= */

  return (
    <div className="min-h-[80vh] rounded-xl p-2 text-[#dceee8] bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F]">
      {/* HEADER */}
      <header className="sticky top-0 z-40 rounded-xl bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132] backdrop-blur-xl border border-[#0B5134]/60 shadow-lg">
        <div className="max-w-6xl mx-auto px-3 py-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#d9ebe5]">
              Syllabus — Web Dev 2026
            </h1>
            <div className="flex flex-wrap gap-2 items-center justify-end">
              <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0ca56d] to-[#18c481] text-black text-sm font-semibold">
                🔥 Streak: {streak} days
              </span>
              <button
                onClick={handleSmartPlanClick}
                className="px-3 py-1.5 rounded-xl text-sm bg-[#0b4766] border border-[#1e6b8b]/60 hover:bg-[#08364d]"
              >
                🧠 Smart Plan
              </button>
              <button
                onClick={exportProgress}
                className="px-3 py-1.5 rounded-xl text-sm bg-[#1b2838] border border-[#3b4a5a]/60 hover:bg-[#17212d]"
              >
                ⬇ Export
              </button>
              <label className="px-3 py-1.5 rounded-xl text-sm bg-[#1b2838] border border-[#3b4a5a]/60 hover:bg-[#17212d] cursor-pointer">
                ⬆ Import
                <input
                  type="file"
                  accept="application/json"
                  onChange={importProgress}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => {
                  if (
                    !confirm("Reset ALL syllabus progress, notes and streak?")
                  )
                    return;
                  treeRef.current = deepClone(TREE);
                  updateDashboard({
                    syllabus_tree_v2: treeRef.current,
                    syllabus_notes: {},
                    syllabus_streak: [],
                    syllabus_lastStudied: "",
                    syllabus_meta: {},
                  });
                  scrollTop();
                }}
                className="px-3 py-1.5 rounded-xl text-sm bg-[#B82132] hover:bg-[#9f1828]"
              >
                Reset
              </button>
              {saving && (
                <span className="text-xs text-green-200 animate-pulse">
                  Saving…
                </span>
              )}
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between text-xs text-[#d9ebe5]">
              <span>
                Progress: {grand.done}/{grand.total}
              </span>
              <span className="font-semibold text-[#a7f3d0]">{grand.pct}%</span>
              {lastStudied && (
                <span className="text-[11px] text-emerald-200">
                  Last studied: {lastStudied}
                </span>
              )}
            </div>
            <div className="mt-2 h-2.5 rounded-full bg-black/40 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#22c55e] to-[#4ade80] transition-all duration-700"
                style={{ width: `${grand.pct}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* SEARCH */}
      <div className="max-w-6xl mx-auto px-3 mt-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics…"
          className="w-full px-3 py-2 rounded-xl bg-black/30 border border-[#17443a] text-sm outline-none focus:ring-2 focus:ring-[#3FA796]"
        />
      </div>

      {/* DAILY URGENT LIST */}
      <div className="max-w-6xl mx-auto px-3 mt-4">
        <div className="bg-black/30 border border-[#17443a] rounded-xl p-4">
          <h3 className="font-semibold text-lg mb-2">
            🎯 Today’s Urgent Topics
          </h3>
          {urgentList.length === 0 ? (
            <p className="text-xs text-gray-300">
              🎉 No pending deadlines — great job!
            </p>
          ) : (
            <ul className="space-y-1 text-sm">
              {urgentList.map((i, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between bg-black/25 px-2 py-1 rounded-md border border-[#0B5134]/40"
                >
                  <span>{i.title}</span>
                  <span className="text-xs text-emerald-200">
                    ⏰ {i.deadline}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* TREE */}
      <main className="max-w-6xl mx-auto px-3 py-5 space-y-4">
        <TreeView
          node={filteredTree}
          path={[]}
          notes={notes}
          toggleTask={toggleTask}
          setDeadline={setDeadline}
          setNote={setNote}
        />
      </main>

      {showTop && (
        <button
          onClick={scrollTop}
          className="fixed bottom-4 right-4 px-3 py-2 rounded-full bg-black/70 border border-[#3FA796]/70 text-xs"
        >
          ⬆ Top
        </button>
      )}
    </div>
  );
}

/* ======================= RECURSIVE TREE VIEW ======================= */

function TreeView({ node, path, notes, toggleTask, setDeadline, setNote }) {
  if (!node) return null;

  if (Array.isArray(node)) {
    return (
      <div className="space-y-2 mt-2">
        {node.map((item, idx) => {
          const p = [...path, idx];
          const key = pathKey(p);
          const noteVal = notes[key] || "";

          return (
            <div
              key={key}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-black/25 border border-white/10 rounded-xl px-3 py-2"
            >
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1 accent-emerald-400"
                  checked={!!item.done}
                  onChange={() => toggleTask(p)}
                />
                <div>
                  <div
                    className={`text-sm ${
                      item.done ? "line-through opacity-60" : ""
                    }`}
                  >
                    {item.title}
                  </div>
                  {item.deadline && (
                    <div className="text-[11px] text-emerald-200/80">
                      ⏰ {item.deadline}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <button
                  onClick={() => setDeadline(p)}
                  className="text-[11px] px-2 py-1 rounded-lg bg-[#102720] border border-[#1e6b4c]/60 hover:bg-[#0b1f18]"
                >
                  📅 Deadline
                </button>
                <textarea
                  value={noteVal}
                  onChange={(e) => setNote(p, e.target.value)}
                  placeholder="Note…"
                  rows={1}
                  className="text-[11px] w-full sm:w-48 px-2 py-1 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-300 resize-none"
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(node).map(([title, child]) => {
        const p = [...path, title];
        const info = totalsOf(child, new WeakSet());

        return (
          <section
            key={pathKey(p)}
            className="rounded-2xl bg-black/25 border border-white/10 shadow-md"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-sm md:text-base font-semibold text-[#E6F1FF]">
                  {title}
                </div>
                <div className="text-[11px] text-emerald-200/80">
                  {info.done}/{info.total} • {info.pct}% done
                </div>
              </div>
              <div className="w-24 h-1.5 rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#22c55e] to-[#4ade80]"
                  style={{ width: `${info.pct}%` }}
                />
              </div>
            </div>
            <div className="px-4 pb-3">
              <TreeView
                node={child}
                path={p}
                notes={notes}
                toggleTask={toggleTask}
                setDeadline={setDeadline}
                setNote={setNote}
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}
