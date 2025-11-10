import { useEffect, useMemo, useRef, useState } from "react";

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
        title: "Implementing shadow property.",
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


/* ======================= KEYS ======================= */
const K_TREE = "syllabus_tree_v2";
const K_META = "syllabus_meta_v2";
const K_NOTES = "syllabus_notes_v2";
const K_STREAK = "syllabus_streak_v2";



/* ======================= UTIL ======================= */
const isArray = Array.isArray;
const isObject = (o) => !!o && typeof o === "object" && !Array.isArray(o);
const todayISO = () => new Date().toISOString().slice(0, 10);
const deepClone = (o) => JSON.parse(JSON.stringify(o || {}));
const pathKey = (path) => (path || []).join(" > ");
const itemKey = (path, idx) => `${pathKey(path)} ## ${idx}`;

function formatDateDDMMYYYY(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  return `${dd}-${mm}-${yyyy}`;
}
function daysDiff(aISO, bISO) {
  if (!aISO || !bISO) return null;
  const a = new Date(aISO);
  const b = new Date(bISO);
  if (isNaN(a) || isNaN(b)) return null;
  const ms = a.setHours(0, 0, 0, 0) - b.setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000);
}
function getRefAtPath(obj, path) {
  let ref = obj;
  for (const part of path) {
    if (!ref || typeof ref !== "object") return undefined;
    ref = ref[part];
  }
  return ref;
}
function totalsOf(node) {
  if (isArray(node)) {
    const total = node.length;
    const done = node.filter((i) => i.done).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }
  let total = 0,
    done = 0;
  for (const v of Object.values(node || {})) {
    const t = totalsOf(v);
    total += t.total;
    done += t.done;
  }
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}
function normalizeSection(sectionObj) {
  const out = {};
  for (const [rawKey, value] of Object.entries(sectionObj || {})) {
    if (!rawKey.includes("›")) {
      out[rawKey] = isArray(value) ? deepClone(value) : normalizeSection(value);
      continue;
    }
    const parts = rawKey
      .split("›")
      .map((s) => s.trim())
      .filter(Boolean);
    let ref = out;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (i === parts.length - 1)
        ref[p] = isArray(value) ? deepClone(value) : normalizeSection(value);
      else {
        if (!isObject(ref[p])) ref[p] = {};
        ref = ref[p];
      }
    }
  }
  return out;
}
function normalizeWholeTree(src) {
  const out = {};
  for (const [k, v] of Object.entries(src || {})) out[k] = normalizeSection(v);
  return out;
}

/* ======================= MAIN ======================= */
export default function Syllabus() {
  const [tree, setTree] = useState(() => {
    try {
      const s = localStorage.getItem(K_TREE);
      if (s) return JSON.parse(s);
    } catch {}
    return normalizeWholeTree(TREE);
  });
  const [meta, setMeta] = useState(() => {
    try {
      const s = localStorage.getItem(K_META);
      if (s) return JSON.parse(s);
    } catch {}
    const m = {};
    for (const [secKey, secVal] of Object.entries(tree)) {
      m[pathKey([secKey])] = { open: false, targetDate: "", targetPct: 100 };
      seedChildMeta(m, [secKey], secVal);
    }
    return m;
  });
  const [nr, setNR] = useState(() => {
    try {
      const s = localStorage.getItem(K_NOTES);
      if (s) return JSON.parse(s);
    } catch {}
    return {};
  });
  const [daySet, setDaySet] = useState(() => {
    try {
      const s = localStorage.getItem(K_STREAK);
      if (s) return new Set(JSON.parse(s));
    } catch {}
    return new Set();
  });
  const [query, setQuery] = useState("");
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [milestone, setMilestone] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const streak = useMemo(() => {
    const has = (iso) => daySet.has(iso);
    let st = 0;
    const d = new Date();
    for (;;) {
      const iso = d.toISOString().slice(0, 10);
      if (has(iso)) st++;
      else break;
      d.setDate(d.getDate() - 1);
    }
    return st;
  }, [daySet]);

  /* persist */
  useEffect(() => {
    try {
      localStorage.setItem(K_TREE, JSON.stringify(tree));
    } catch {}
  }, [tree]);
  useEffect(() => {
    try {
      localStorage.setItem(K_META, JSON.stringify(meta));
    } catch {}
  }, [meta]);
  const nrSaveRef = useRef(null);
  useEffect(() => {
    clearTimeout(nrSaveRef.current);
    nrSaveRef.current = setTimeout(() => {
      try {
        localStorage.setItem(K_NOTES, JSON.stringify(nr));
      } catch {}
    }, 200);
    return () => clearTimeout(nrSaveRef.current);
  }, [nr]);
  useEffect(() => {
    try {
      localStorage.setItem(K_STREAK, JSON.stringify(Array.from(daySet)));
    } catch {}
  }, [daySet]);

  /* ui misc */
  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const grand = useMemo(() => totalsOf(tree), [tree]);

  function seedChildMeta(m, path, node) {
    if (isArray(node)) {
      const k = pathKey(path);
      if (!m[k]) m[k] = { open: false, targetDate: "" };
      return;
    }
    for (const [name, child] of Object.entries(node || {})) {
      const k = pathKey([...path, name]);
      if (!m[k]) m[k] = { open: false, targetDate: "" };
      seedChildMeta(m, [...path, name], child);
    }
  }

  /* actions */
  const toggleOpen = (path) =>
    setMeta((m) => {
      const k = pathKey(path);
      const nowOpen = !m[k]?.open;
      const next = { ...m, [k]: { ...(m[k] || {}), open: nowOpen } };
      if (!nowOpen) {
        const node = getRefAtPath(tree, path);
        (function closeAll(n, p) {
          if (isArray(n)) return;
          for (const [name, child] of Object.entries(n || {})) {
            const ck = pathKey([...p, name]);
            next[ck] = { ...(next[ck] || {}), open: false };
            closeAll(child, [...p, name]);
          }
        })(node, path);
      }
      return next;
    });
  const onSectionHeaderClick = (path) => toggleOpen(path);
  const setTargetDate = (path, date) =>
    setMeta((m) => ({
      ...m,
      [pathKey(path)]: { ...(m[pathKey(path)] || {}), targetDate: date },
    }));
  const setSectionTargetPct = (secKey, pct) =>
    setMeta((m) => ({
      ...m,
      [pathKey([secKey])]: {
        ...(m[pathKey([secKey])] || {}),
        targetPct: Number(pct || 0),
      },
    }));

  const setAllAtPath = (path, val) => {
    setTree((old) => {
      const t = deepClone(old);
      const node = getRefAtPath(t, path);
      (function mark(n) {
        if (isArray(n)) {
          n.forEach((it) => {
            it.done = val;
            it.completedOn = val ? todayISO() : "";
          });
          return;
        }
        for (const v of Object.values(n || {})) mark(v);
      })(node);
      return t;
    });
    if (val) setDaySet((s) => new Set(s).add(todayISO()));
  };

  const setTaskDeadline = (path, idx, date) => {
    setTree((old) => {
      const t = deepClone(old);
      const parent = getRefAtPath(t, path.slice(0, -1));
      const leafKey = path[path.length - 1];
      parent[leafKey][idx].deadline = date;
      return t;
    });
  };

  const markTask = (path, idx, val) => {
    setTree((old) => {
      const t = deepClone(old);
      const parent = getRefAtPath(t, path.slice(0, -1));
      const leafKey = path[path.length - 1];
      const item = parent[leafKey][idx];
      item.done = val;
      item.completedOn = val ? todayISO() : "";
      return t;
    });
    if (val) setDaySet((prev) => new Set(prev).add(todayISO()));
  };

  /* search filter (structure-preserving) */
  const filtered = useMemo(() => {
    if (!query.trim()) return tree;
    const q = query.toLowerCase();
    function filterNode(node) {
      if (isArray(node)) {
        const items = node.filter((it) =>
          (it.title || "").toLowerCase().includes(q)
        );
        return items.length ? items : null;
      }
      const out = {};
      for (const [k, v] of Object.entries(node || {})) {
        const matchKey = (k || "").toLowerCase().includes(q);
        const fn = filterNode(v);
        if (matchKey && !fn) out[k] = v;
        else if (fn && (isArray(fn) ? fn.length : Object.keys(fn).length))
          out[k] = fn;
      }
      return Object.keys(out).length ? out : null;
    }
    return filterNode(tree) || {};
  }, [tree, query]);

  const generateSmartPlan = (availableMins) => {
    const leaves = [];
    function walk(node, path) {
      if (isArray(node)) {
        node.forEach((it, idx) => {
          if (!it.done)
            leaves.push({
              title: it.title,
              deadline: it.deadline || "",
              estimate: Math.max(
                0.25,
                Number(nr[itemKey(path, idx)]?.estimate || 0.5)
              ),
            });
        });
        return;
      }
      for (const [k, v] of Object.entries(node || {})) walk(v, [...path, k]);
    }
    walk(tree, []);
    const scored = leaves
      .map((l) => ({
        ...l,
        score:
          (l.deadline ? Date.parse(l.deadline) : Number.POSITIVE_INFINITY) +
          l.estimate * 1000,
      }))
      .sort((a, b) => a.score - b.score);
    const plan = [];
    let remaining = availableMins;
    for (const t of scored) {
      const mins = Math.round(t.estimate * 60);
      if (mins <= remaining) {
        plan.push(t);
        remaining -= mins;
      }
      if (remaining < 15) break;
    }
    return { plan, remaining };
  };

  /* ======================= RENDER ======================= */
  return (
    <div className="min-h-screen bg-[#FF8F8F]/10 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="sticky top-0 z-40 backdrop-blur bg-[#FF8F8F]/40 dark:bg-gray-900/70 border-b border-[#FF8F8F]/40 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-3 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 mb-3 w-full">
            {/* ✅ Title */}
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Syllabus
            </h1>
            {/* ✅ Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <span className="px-2 py-1.5 rounded-lg bg-white/70 dark:bg-gray-800 text-xs border border-[#FF8F8F]/40">
                🔥 Streak: <b>{Array.from(daySet).length}</b> days
              </span>
              <button
                onClick={() =>
                  setMeta((m) => {
                    const c = { ...m };
                    Object.keys(c).forEach((k) => (c[k].open = true));
                    return c;
                  })
                }
                className="px-3 py-1.5 rounded-xl bg-[#FF8F8F] text-white text-sm"
              >
                Expand
              </button>
              <button
                onClick={() =>
                  setMeta((m) => {
                    const c = { ...m };
                    Object.keys(c).forEach((k) => (c[k].open = false));
                    return c;
                  })
                }
                className="px-3 py-1.5 rounded-xl bg-[#FF8F8F]/20 text-gray-900 text-sm dark:bg-gray-800 dark:text-gray-100"
              >
                Collapse
              </button>
              <button
                onClick={() => {
                  if (!confirm("Reset ALL syllabus progress? Gym data safe ✅"))
                    return;
                  setTree((old) => {
                    const t = deepClone(old);
                    (function reset(n) {
                      if (Array.isArray(n)) {
                        n.forEach((it) => {
                          it.done = false;
                          it.completedOn = "";
                          it.deadline = "";
                        });
                        return;
                      }
                      for (const v of Object.values(n || {})) reset(v);
                    })(t);
                    return t;
                  });
                  setMeta({});
                  setNR({});
                  setDaySet(new Set());
                  localStorage.removeItem("K_TREE");
                  localStorage.removeItem("K_META");
                  localStorage.removeItem("K_NOTES");
                  localStorage.removeItem("K_STREAK");
                  window.location.reload();
                }}
                className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-sm"
              >
                Reset
              </button>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topics..."
                className="px-3 py-1.5 rounded-xl border border-[#FF8F8F]/40 bg-white/80 dark:bg-gray-800 dark:border-gray-700 outline-none"
              />
            </div>
            {
              /* ✅ Mobile Hamburger Menu */
            }
            <div className="md:hidden relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="px-3 py-2 rounded-lg bg-[#FF8F8F] text-white"
              >
                ☰
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 flex flex-col gap-2 shadow-lg z-50">
                  <span className="px-2 py-1.5 rounded-md bg-gray-200 dark:bg-gray-700 text-xs">
                    🔥 Streak: {Array.from(daySet).length} days
                  </span>
                  <button
                    onClick={() => {
                      setMeta((m) => {
                        const c = { ...m };
                        Object.keys(c).forEach((k) => (c[k].open = true));
                        return c;
                      });
                      setMenuOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-md bg-[#FF8F8F] text-white text-sm"
                  >
                    Expand
                  </button>
                  <button
                    onClick={() => {
                      setMeta((m) => {
                        const c = { ...m };
                        Object.keys(c).forEach((k) => (c[k].open = false));
                        return c;
                      });
                      setMenuOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-md bg-gray-300 dark:bg-gray-700 text-sm"
                  >
                    Collapse
                  </button>
                  <button
                    onClick={() => {
                      if (
                        !confirm(
                          "Reset syllabus only? Gym data will not be removed."
                        )
                      )
                        return;
                      setTree((old) => {
                        const t = deepClone(old);
                        (function reset(n) {
                          if (Array.isArray(n)) {
                            n.forEach((it) => {
                              it.done = false;
                              it.completedOn = "";
                              it.deadline = "";
                            });
                            return;
                          }
                          for (const v of Object.values(n || {})) reset(v);
                        })(t);
                        return t;
                      });
                      setMeta({});
                      setNR({});
                      setDaySet(new Set());
                      localStorage.removeItem("K_TREE");
                      localStorage.removeItem("K_META");
                      localStorage.removeItem("K_NOTES");
                      localStorage.removeItem("K_STREAK");
                      window.location.reload();
                    }}
                    className="px-3 py-1.5 rounded-md bg-red-500 text-white text-sm"
                  >
                    Reset
                  </button>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="px-2 py-1.5 rounded-md border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium">
                Progress: {grand.done}/{grand.total}
              </span>
              <span className="font-semibold">{grand.pct}%</span>
            </div>
            <div className="h-4 bg-[#FF8F8F]/25 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF8F8F]"
                style={{ width: `${grand.pct}%` }}
              />
            </div>
          </div>
        </div>
      </header>
      {/* Smart Planner + Smart Suggest */}
      <div className="w-full px-3 mt-6 pb-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#FF8F8F]/40 bg-white/90 dark:bg-gray-900/60 dark:border-gray-800 p-3">
          <h2 className="font-semibold mb-2">🗓️ Daily Auto Planner</h2>
          <p className="text-sm opacity-80 mb-3">
            Closest-deadline topics not yet done.
          </p>
          <DailyPlanner tree={tree} />
        </div>
        <SmartSuggest generateSmartPlan={generateSmartPlan} />
      </div>

      <main className="w-full px-3 md:px-4 space-y-4 ">
        {Object.keys(filtered).length === 0 && (
          <div className="text-sm text-gray-700 dark:text-gray-300">
            No matches for “{query}”.
          </div>
        )}
        {Object.entries(filtered).map(([secKey, secVal]) => (
          <SectionCard
            key={secKey}
            secKey={secKey}
            node={secVal}
            meta={meta}
            nr={nr}
            setNR={setNR}
            onSectionHeaderClick={onSectionHeaderClick}
            setSectionTargetPct={setSectionTargetPct}
            setTargetDate={setTargetDate}
            toggleOpen={toggleOpen}
            setAllAtPath={setAllAtPath}
            markTask={markTask}
            setTaskDeadline={setTaskDeadline}
          />
        ))}
      </main>

      {showTopBtn && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-4 z-40 h-11 w-11 rounded-full shadow-lg bg-[#FF8F8F] text-white flex items-center justify-center text-xl"
        >
          ↑
        </button>
      )}
      {milestone && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-emerald-500 text-white shadow">
          {milestone}
        </div>
      )}
    </div>
  );
}

/* ======================= PARTS ======================= */
function SectionCard({
  secKey,
  node,
  meta,
  nr,
  setNR,
  onSectionHeaderClick,
  setTargetDate,
  toggleOpen,
  setAllAtPath,
  markTask,
  setTaskDeadline,
}) {
  const sectionPath = [secKey];
  const m = meta[pathKey(sectionPath)] || { open: false, targetDate: "" };
  const totals = totalsOf(node);
  const allDone = totals.total > 0 && totals.done === totals.total;

  // ✅ Get latest completed date from this section
  function getSectionCompletionDate(n) {
    let latest = null;
    if (Array.isArray(n)) {
      n.forEach((task) => {
        if (task?.done && task?.completedOn) {
          const d = new Date(task.completedOn);
          if (!latest || d > latest) latest = d;
        }
      });
    } else {
      for (const [k, v] of Object.entries(n || {})) {
        const d = getSectionCompletionDate(v);
        if (d && (!latest || d > latest)) latest = d;
      }
    }
    return latest;
  }
  const latestDone = getSectionCompletionDate(node);

  // ✅ Rollup total estimated hours for this section
  const hoursRollup = useMemo(() => {
    let est = 0;
    (function walk(n, p) {
      if (Array.isArray(n)) {
        n.forEach((_, idx) => {
          const e = Number(nr[itemKey(p, idx)]?.estimate || 0.5);
          est += isFinite(e) ? e : 0.5;
        });
      } else {
        for (const [k, v] of Object.entries(n || {})) walk(v, [...p, k]);
      }
    })(node, sectionPath);
    return est;
  }, [node, nr]);

  return (
    <section className="rounded-2xl border border-[#FF8F8F]/40 dark:border-gray-800 bg-[#FF8F8F]/15 dark:bg-gray-900/60 shadow-sm">
      {/* ✅ Progress bar on top */}
      <div className="w-full p-3">
        <div className="h-2 bg-[#FF8F8F]/25 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FF8F8F] transition-all"
            style={{ width: `${totals.pct}%` }}
          />
        </div>
      </div>

      {/* ✅ Header Row (Title + Completion message + Actions + Stats) */}
      <div
        onClick={() => onSectionHeaderClick(sectionPath)}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-3 pb-3 select-none"
      >
        {/* LEFT — Title + Completed message */}
        <div className="flex items-center gap-2 flex-1">
          <span
            className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
              m.open
                ? "bg-[#FF8F8F] text-white border-[#FF8F8F]"
                : "bg-[#FF8F8F]/30 text-gray-900 border-[#FF8F8F]/50"
            }`}
          >
            {m.open ? "−" : "+"}
          </span>
          <h2 className="text-base md:text-lg font-semibold">{secKey}</h2>

          {/* ✅ Show completed before/after/target only if whole section done */}
          {allDone && latestDone && (
            <span className="text-xs text-green-600 ml-2 whitespace-nowrap">
              {(() => {
                if (m.targetDate) {
                  const done = new Date(latestDone);
                  const target = new Date(m.targetDate);
                  done.setHours(0, 0, 0, 0);
                  target.setHours(0, 0, 0, 0);
                  const diff = Math.round((done - target) / 86400000);
                  if (diff < 0)
                    return `✅ Completed ${Math.abs(
                      diff
                    )} day(s) before target`;
                  if (diff > 0)
                    return `✅ Completed ${diff} day(s) after target`;
                  return `✅ Completed on target date`;
                }
                return `✅ Completed on ${formatDateDDMMYYYY(latestDone)}`;
              })()}
            </span>
          )}
        </div>

        {/* RIGHT — Stats + Complete All + Target Date */}
        <div
          className="flex items-center gap-3 text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ✅ Moved stats from under progress bar to here (compact) */}
          <span className="opacity-75 whitespace-nowrap">
            {totals.done}/{totals.total} • {totals.pct}% • ~
            {hoursRollup.toFixed(1)}h
          </span>

          {/* Complete All / Undo All */}
          <button
            onClick={() => setAllAtPath(sectionPath, !allDone)}
            className="px-2.5 py-1 rounded-lg bg-[#FF8F8F]/20 text-gray-900 text-xs dark:bg-gray-800 dark:text-gray-100"
          >
            {allDone ? "Undo all" : "Mark all"}
          </button>

          {/* 🎯 Target Date */}
          <label className="flex items-center gap-1.5 text-sm">
            <span className="opacity-80">🎯</span>
            <input
              type="date"
              value={m.targetDate}
              onChange={(e) => setTargetDate(sectionPath, e.target.value)}
              className="px-2 py-1 rounded-lg border border-[#FF8F8F]/50 bg-white/80 dark:bg-gray-800 dark:border-gray-700 outline-none"
            />
          </label>
        </div>
      </div>

      {/* ✅ Collapsible Subtopics */}
      {m.open && (
        <div className="px-3 pb-3 space-y-3">
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
      )}
    </section>
  );
}

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
  const k = pathKey(path);
  const m = meta[k] || { open: false, targetDate: "" };
  const totals = totalsOf(node);
  const allDone = totals.total > 0 && totals.done === totals.total;

  // rollup hours for subnode
  const hoursRollup = useMemo(() => {
    if (!isArray(node)) {
      let est = 0;
      for (const [childKey, childVal] of Object.entries(node || {})) {
        if (isArray(childVal))
          childVal.forEach((_, idx) => {
            const e = Number(
              nr[itemKey([...path, childKey], idx)]?.estimate || 0.5
            );
            est += isFinite(e) ? e : 0.5;
          });
        else
          Object.entries(childVal || {}).forEach(([gk, gv]) => {
            if (isArray(gv))
              gv.forEach((_, idx) => {
                const e = Number(
                  nr[itemKey([...path, childKey, gk], idx)]?.estimate || 0.5
                );
                est += isFinite(e) ? e : 0.5;
              });
          });
      }
      return est;
    }
    return node.reduce((s, _, idx) => {
      const e = Number(nr[itemKey(path, idx)]?.estimate || 0.5);
      return s + (isFinite(e) ? e : 0.5);
    }, 0);
  }, [node, nr, path]);

  return (
    <div className="rounded-xl border border-[#FF8F8F]/35 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50">
      {/* header row */}
      <div
        onClick={() => toggleOpen(path)}
        className="flex items-center justify-between gap-2 p-2 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-md border ${
              m.open
                ? "bg-[#FF8F8F] text-white border-[#FF8F8F]"
                : "bg-[#FF8F8F]/20 border-[#FF8F8F]/50"
            }`}
          >
            {m.open ? "−" : "+"}
          </span>
          <div className="font-medium">{name}</div>
        </div>
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[11px] opacity-75 text-right">
            {totals.done}/{totals.total} • {totals.pct}% • ~
            {hoursRollup.toFixed(1)}h
          </div>
          <button
            onClick={() => setAllAtPath(path, !allDone)}
            className="px-2 py-0.5 rounded-md bg-[#FF8F8F]/20 text-xs"
          >
            {allDone ? "Undo all" : "Complete all"}
          </button>
          <input
            type="date"
            value={m.targetDate}
            onChange={(e) => setTargetDate(path, e.target.value)}
            className="px-2 py-1 rounded-md border border-[#FF8F8F]/50 bg-white/80 dark:bg-gray-800 dark:border-gray-700 outline-none text-xs"
          />
        </div>
      </div>

      {/* content */}
      <div
        className={`grid transition-all duration-500 ease-out ${
          m.open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        } overflow-hidden`}
      >
        <div className="overflow-hidden">
          {isArray(node) ? (
            <ul className="space-y-2 px-2 pb-2">
              {node.map((it, idx) => {
                const diff =
                  m.targetDate && it.completedOn
                    ? daysDiff(it.completedOn, m.targetDate)
                    : null;
                let statusLine = "";
                if (it.done) {
                  if (diff === null)
                    statusLine = `✅ Completed on ${formatDateDDMMYYYY(
                      it.completedOn
                    )}`;
                  else if (diff > 0)
                    statusLine = `✅ Completed ${diff} day${
                      diff === 1 ? "" : "s"
                    } after target`;
                  else if (diff < 0) {
                    const before = Math.abs(diff);
                    statusLine = `✅ Completed ${before} day${
                      before === 1 ? "" : "s"
                    } before target`;
                  } else statusLine = "✅ Completed on target date";
                }

                return (
                  <li
                    key={idx}
                    onClick={(e) => {
                      // Prevent marking task as complete when clicking on input fields
                      if (
                        e.target.type !== "date" &&
                        e.target.type !== "number"
                      ) {
                        markTask(path, idx, !it.done);
                      }
                    }}
                    className={`rounded-lg border border-[#FF8F8F]/25 dark:border-gray-800 p-2 bg-white/70 dark:bg-gray-900/40 cursor-pointer select-none ${
                      it.done ? "opacity-90" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* ✅ LEFT — Checkbox + Title */}
                      <div className="flex items-start gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={!!it.done}
                          onChange={(e) => {
                            e.stopPropagation();
                            markTask(path, idx, e.target.checked);
                          }}
                          className="mt-0.5 shrink-0"
                        />
                        <div className="min-w-0">
                          <div
                            className={`truncate ${
                              it.done ? "line-through" : ""
                            }`}
                          >
                            {it.title}
                          </div>

                          {/* ✅ STATUS — BELOW TITLE (fixed space for no layout shift) */}
                          <div className="text-xs text-gray-500 min-h-[1.25rem] leading-4">
                            {it.done && it.completedOn
                              ? (() => {
                                  if (it.deadline) {
                                    const doneDate = new Date(it.completedOn);
                                    const targetDate = new Date(it.deadline);

                                    doneDate.setHours(0, 0, 0, 0);
                                    targetDate.setHours(0, 0, 0, 0);

                                    const diff = Math.round(
                                      (doneDate - targetDate) / 86400000
                                    );

                                    if (diff < 0) {
                                      return `✅ Completed ${Math.abs(
                                        diff
                                      )} day${
                                        Math.abs(diff) === 1 ? "" : "s"
                                      } before target`;
                                    }
                                    if (diff > 0) {
                                      return `✅ Completed ${diff} day${
                                        diff === 1 ? "" : "s"
                                      } after target`;
                                    }
                                    return "✅ Completed on target date";
                                  }
                                  return `✅ Completed on ${formatDateDDMMYYYY(
                                    it.completedOn
                                  )}`;
                                })()
                              : ""}
                          </div>
                        </div>
                      </div>

                      {/* ✅ RIGHT — Deadline + Hours */}
                      <div
                        className="flex items-center gap-3 shrink-0"
                        onClick={(e) => e.stopPropagation()} // prevent click bubbling
                      >
                        {/* Deadline */}
                        <label className="text-xs flex items-center gap-1">
                          ⏰
                          <input
                            type="date"
                            value={it.deadline || ""}
                            onChange={(e) =>
                              setTaskDeadline(path, idx, e.target.value)
                            }
                            className="px-2 py-1 rounded-md border border-[#FF8F8F]/50 bg-white/80 dark:bg-gray-800 dark:border-gray-700 outline-none"
                          />
                        </label>

                        {/* Estimated Hours */}
                        <label className="text-xs flex items-center gap-1">
                          ⏱
                          <input
                            type="number"
                            min={0}
                            step="0.25"
                            value={nr[itemKey(path, idx)]?.estimate ?? 0.5}
                            onChange={(e) =>
                              setNR((old) => ({
                                ...old,
                                [itemKey(path, idx)]: {
                                  ...(old[itemKey(path, idx)] || {
                                    notes: "",
                                    resources: "",
                                  }),
                                  estimate: Number(e.target.value || 0),
                                },
                              }))
                            }
                            className="w-16 px-2 py-1 rounded-md border border-[#FF8F8F]/50 bg-white/80 dark:bg-gray-800 dark:border-gray-700 outline-none"
                          />
                          <span>h</span>
                        </label>
                      </div>
                    </div>

                    {/* ✅ Notes & Resources Section (Unchanged) */}
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs opacity-80">
                        🗒️ Notes & 📚 Resources
                      </summary>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <textarea
                          placeholder="Notes…"
                          value={nr[itemKey(path, idx)]?.notes ?? ""}
                          onChange={(e) =>
                            setNR((old) => ({
                              ...old,
                              [itemKey(path, idx)]: {
                                ...(old[itemKey(path, idx)] || {
                                  estimate: 0.5,
                                  resources: "",
                                }),
                                notes: e.target.value,
                              },
                            }))
                          }
                          className="min-h-[80px] rounded-md border border-[#FF8F8F]/40 bg-white/90 dark:bg-gray-800 dark:border-gray-700 p-2 text-sm"
                        />
                        <textarea
                          placeholder="Links (comma/newline)…"
                          value={nr[itemKey(path, idx)]?.resources ?? ""}
                          onChange={(e) =>
                            setNR((old) => ({
                              ...old,
                              [itemKey(path, idx)]: {
                                ...(old[itemKey(path, idx)] || {
                                  estimate: 0.5,
                                  notes: "",
                                }),
                                resources: e.target.value,
                              },
                            }))
                          }
                          className="min-h-[80px] rounded-md border border-[#FF8F8F]/40 bg-white/90 dark:bg-gray-800 dark:border-gray-700 p-2 text-sm"
                        />
                      </div>
                    </details>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="grid grid-cols-1 gap-2 px-2 pb-2">
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
  );
}

/* Daily Planner — excludes completed, shows only titles + deadlines */
function DailyPlanner({ tree }) {
  const items = [];
  (function walk(node, path) {
    if (Array.isArray(node)) {
      node.forEach((it) => {
        if (!it.done)
          items.push({ title: it.title, deadline: it.deadline || "" });
      });
      return;
    }
    for (const [k, v] of Object.entries(node || {})) walk(v, [...path, k]);
  })(tree, []);
  const withDeadlines = items
    .map((i) => ({
      ...i,
      d: i.deadline ? Date.parse(i.deadline) : Number.POSITIVE_INFINITY,
    }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 6);
  return (
    <ul className="text-sm list-disc pl-5 space-y-1">
      {withDeadlines.map((i, idx) => (
        <li key={idx} className="flex items-center justify-between gap-2">
          <span>{i.title}</span>
          {i.deadline ? (
            <span className="text-xs opacity-70">
              ⏰ {formatDateDDMMYYYY(i.deadline)}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/* Smart Suggest — hides completion info */
function SmartSuggest({ generateSmartPlan }) {
  const [mins, setMins] = useState(120);
  const [plan, setPlan] = useState(null);
  return (
    <div className="rounded-2xl border border-[#FF8F8F]/40 bg-white/90 dark:bg-gray-900/60 dark:border-gray-800 p-3">
      <h2 className="font-semibold mb-2">🤖 Smart Suggest</h2>
      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm flex items-center gap-2">
          Minutes:
          <input
            type="number"
            value={mins}
            onChange={(e) => setMins(Number(e.target.value || 0))}
            className="w-24 px-2 py-1 rounded-md border border-[#FF8F8F]/50 bg-white/80 dark:bg-gray-800 dark:border-gray-700 outline-none"
          />
        </label>
        <button
          onClick={() => setPlan(generateSmartPlan(mins))}
          className="px-3 py-1.5 rounded-lg bg-[#FF8F8F] text-white text-sm"
        >
          Suggest
        </button>
      </div>
      {plan && (
        <div className="text-sm">
          {plan.plan.length ? (
            <>
              <ul className="list-disc pl-5 space-y-1">
                {plan.plan.map((t, i) => (
                  <li key={i}>
                    {t.title} — ~{Math.round(t.estimate * 60)} mins{" "}
                    {t.deadline && (
                      <em className="opacity-70">
                        {" "}
                        (⏰ {formatDateDDMMYYYY(t.deadline)})
                      </em>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-2 opacity-75">
                Remaining buffer: {plan.remaining} mins
              </div>
            </>
          ) : (
            <div className="opacity-75">
              Not enough time to suggest a set. Try increasing minutes.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
