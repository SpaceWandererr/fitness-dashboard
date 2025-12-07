import { useEffect, useMemo, useRef, useState, useCallback } from "react";

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

if (!window.TREE) window.TREE = TREE;

// Stabilize meta reference to prevent re-renders
// Fixed: Always return the latest value, not stale ref.current
function useStable(obj) {
  const ref = useRef(obj);
  // Update ref synchronously to avoid stale reads
  if (ref.current !== obj) {
    ref.current = obj;
  }
  return ref.current;
}

/* =======https://fitness-backend-laoe.onrender.com/=============== KEYS ======================= */
const K_TREE = "syllabus_tree_v2";
const K_META = "syllabus_meta_v2";
const K_NOTES = "syllabus_notes_v2";
const K_STREAK = "syllabus_streak_v2";

/* ======================= UTIL ======================= */

/**
 * Check if value is an array
 */
const isArray = Array.isArray;

/**
 * Check if value is a plain object (not null, not array)
 */
const isObject = (o) => !!o && typeof o === "object" && !Array.isArray(o);

/**
 * Returns today's date in YYYY-MM-DD format
 */
const todayISO = () => new Date().toISOString().slice(0, 10);

/**
 * Safe deep clone using JSON method
 * NOTE: Only use for pure JSON objects
 */
const deepClone = (o) => JSON.parse(JSON.stringify(o || {}));

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

/**
 * Returns number of days between two ISO dates
 * Example: 2025-01-01 and 2025-01-05 → 4
 */
function daysDiff(aISO, bISO) {
  if (!aISO || !bISO) return null;

  const a = new Date(aISO);
  const b = new Date(bISO);

  if (isNaN(a) || isNaN(b)) return null;

  const ms = a.setHours(0, 0, 0, 0) - b.setHours(0, 0, 0, 0);

  return Math.round(ms / 86400000);
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
 */
function totalsOf(node) {
  // If it's a leaf array
  if (isArray(node)) {
    const total = node.length;
    const done = node.filter((i) => i.done).length;

    return {
      total,
      done,
      pct: total ? Math.round((done / total) * 100) : 0,
    };
  }

  // If it's nested object
  let total = 0;
  let done = 0;

  for (const v of Object.values(node || {})) {
    const t = totalsOf(v);
    total += t.total;
    done += t.done;
  }

  return {
    total,
    done,
    pct: total ? Math.round((done / total) * 100) : 0,
  };
}

/**
 * Converts flat › format into nested object structure
 * Example:
 * "JS › Basics › Scope": [items]
 * becomes:
 * { JS: { Basics: { Scope: [...] } } }
 */
function normalizeSection(sectionObj) {
  if (!sectionObj || typeof sectionObj !== "object") return sectionObj;

  // 🚨 Prevent recursion on already normalized tree
  if (sectionObj.__normalized) return sectionObj;

  const out = {};

  for (const [rawKey, value] of Object.entries(sectionObj)) {
    if (rawKey === "__normalized") continue;

    if (!rawKey.includes("›")) {
      out[rawKey] = Array.isArray(value)
        ? structuredClone(value)
        : normalizeSection(value);
      continue;
    }

    const parts = rawKey
      .split("›")
      .map((p) => p.trim())
      .filter(Boolean);
    let ref = out;

    parts.forEach((p, i) => {
      if (i === parts.length - 1) {
        ref[p] = Array.isArray(value)
          ? structuredClone(value)
          : normalizeSection(value);
      } else {
        if (!ref[p] || typeof ref[p] !== "object") ref[p] = {};
        ref = ref[p];
      }
    });
  }

  out.__normalized = true; // 🔥 mark as normalized
  return out;
}



/**
 * Normalizes your entire syllabus TREE
 * Converts all sections into nested structures
 */
// keep for compatibility but delegate to normalized version
const normalizeWholeTree = (src) => normalizeTree(src);

// Add this somewhere near the top (replace old todayISO if exists)
const nowISO = () => new Date().toISOString(); // e.g. "2025-11-30T13:45:22.123Z"

// Make TREE available globally so App.jsx can use syllabus data
window.TREE = TREE;

/* ======================= MAIN ======================= */
export default function Syllabus({ dashboardState, setDashboardState }) {
  // ---------------- MONGO CONFIG ----------------
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://fitness-backend-laoe.onrender.com/api/state";

  // ⛑ Guard: prevent crash before state arrives
  if (!dashboardState) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#0b0b10]">
        <div className="relative">
          {/* Pulsing ring */}
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />

          {/* Content */}
          <div className="relative rounded-2xl border border-emerald-500/30 bg-black/60 px-8 py-6 backdrop-blur-xl shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <div className="flex items-center gap-4">
              {/* Spinning loader */}
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400" />

              {/* Text */}
              <div>
                <p className="font-mono text-sm font-semibold tracking-wider text-emerald-300">
                  INITIALIZING NEURAL CORE
                </p>
                <p className="mt-1 font-mono text-xs text-emerald-400/70">
                  Loading syllabus matrix from database...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ======================= SYNCED STATE FROM MONGO ======================= */
  // 1 BUILD TREE FIRST - FIXED
  // 1 BUILD TREE FIRST - FIXED
  const normalizeTree = useCallback((src) => {
    const out = {};
    for (const [k, v] of Object.entries(src || {})) {
      out[k] = normalizeSection(v);
    }
    return out;
  }, []); // ✅ Stable - never changes

  const tree = useMemo(() => {
    if (dashboardState?.syllabus_tree_v2) {
      return normalizeTree(dashboardState.syllabus_tree_v2);
    }
    return normalizeTree(TREE);
  }, [dashboardState?.syllabus_tree_v2]); // ✅ Now stable

  // 2️⃣ RAW META SECOND
  const meta = dashboardState?.syllabus_meta || {};

  // 3️⃣ STABLE META THIRD - Use useMemo to ensure updates properly
  const stableMeta = useMemo(() => meta, [meta]);

  // 4️⃣ NOTES / REMINDERS
  const nr = dashboardState?.syllabus_notes || {};
  const daySet = new Set(dashboardState?.syllabus_streak || []);

  const [showLastStudied, setShowLastStudied] = useState(true);

  const lastStudied = dashboardState?.syllabus_lastStudied || "";
  const LAST_STUDIED_HIDE_MINUTES = 10;

  const [query, setQuery] = useState("");
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [milestone, setMilestone] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveTimeoutRef = useRef(null);

  /* ======================= CLEANUP TIMEOUT ======================= */
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  /* ======================= AUTO SEED MONGO ======================= */
  /* ======================= INITIAL LOAD & SEEDING (FIXED!) ======================= */
  // 1️⃣ FIRST: Load existing data from MongoDB on mount
  useEffect(() => {
    console.log("🔄 Loading data from MongoDB...");

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("✅ Loaded from MongoDB:", data);
        if (data && Object.keys(data).length > 0) {
          setDashboardState(data);
        } else {
          console.log("📭 No data in MongoDB, will seed fresh data");
        }
      })
      .catch((err) => {
        console.error("❌ Load failed:", err);
      });
  }, [API_URL]); // Only run once on mount

  // 2️⃣ SECOND: Seed if no data exists (your existing code)
  useEffect(() => {
    // Only seed if syllabus_tree_v2 is completely missing (first-time user)
    if (dashboardState?.syllabus_tree_v2) {
      console.log("Syllabus already exists in Mongo. Skipping seed.");
      return;
    }

    console.log("First time setup: Seeding fresh syllabus into Mongo...");

    const freshTree = normalizeTree(TREE);

    const seeded = {
      ...dashboardState,
      syllabus_tree_v2: freshTree,
      syllabus_meta: {},
      syllabus_notes: {},
      syllabus_streak: [],
      syllabus_lastStudied: "",
      syllabus_initialized: true,
    };

    setDashboardState(seeded);

    fetch(API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(seeded),
    })
      .then(() => console.log("Fresh syllabus seeded successfully"))
      .catch((err) => console.error("Seed failed:", err));
  }, [dashboardState?.syllabus_tree_v2]);

  /* ======================= LAST STUDIED AUTO-HIDE ======================= */
  useEffect(() => {
    if (!lastStudied) return;

    setShowLastStudied(true);

    const timer = setTimeout(() => {
      setShowLastStudied(false);
    }, LAST_STUDIED_HIDE_MINUTES * 60 * 1000);

    return () => clearTimeout(timer);
  }, [lastStudied]);

  /* ======================= STREAK ======================= */
  const streak = useMemo(() => {
    const has = (iso) => daySet.has(iso);
    let st = 0;
    const d = new Date();
    while (true) {
      const iso = d.toISOString().slice(0, 10);
      if (has(iso)) st++;
      else break;
      d.setDate(d.getDate() - 1);
    }
    return st;
  }, [dashboardState?.syllabus_streak]);

  const grand = useMemo(() => totalsOf(tree), [tree]);

  /* ======================= DASHBOARD UPDATE ======================= */
  const updateDashboard = useCallback(
    (updates) => {
      setDashboardState((prev) => {
        const newState = {
          ...prev,
          ...updates,
        };

        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
          fetch(API_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newState),
          })
            .then(() => {
              // 🔥 Sync AFTER Mongo saved, not before
              window.lifeOSsync?.();
            })
            .catch((err) => console.error("Mongo save failed:", err));
        }, 500);

        return newState;
      });
    },
    [API_URL]
  );

  /* ======================= ACTIONS ======================= */

  // ✅ Stable Toggle (does not break after Mongo re-render)
  const toggleOpen = useCallback(
    (path) => {
      const key = pathKey(path);

      // Use functional update to read latest state
      setDashboardState((prev) => {
        const current = prev?.syllabus_meta || {};
        const prevOpen = current[key]?.open || false;

        const newState = {
          ...prev,
          syllabus_meta: {
            ...current,
            [key]: {
              ...(current[key] || {}),
              open: !prevOpen,
            },
          },
        };

        // Save to MongoDB asynchronously AFTER state update (debounced, no event)
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
          fetch(API_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newState),
          }).catch((err) => console.error("Mongo save failed:", err));
        }, 500); // Debounce saves by 500ms

        return newState;
      });
    },
    [API_URL]
  );

  // alias for Section header click
  const onSectionHeaderClick = (path) => {
    toggleOpen(path);
  };

  const setTargetDate = (path, date) => {
    const key = pathKey(path);
    const newTree = deepClone(tree);
    const node = getRefAtPath(newTree, path);
    const updatedMeta = {
      ...meta,
      [key]: { ...(meta[key] || {}), targetDate: date },
    };

    // Cascade deadline to all nested subsections and topics
    function cascadeDeadline(node, deadline, currentPath, metaObj) {
      if (Array.isArray(node)) {
        // It's a task list - set deadline for all tasks
        node.forEach((item) => {
          if (!item.deadline) {
            item.deadline = deadline;
          }
        });
      } else if (isObject(node)) {
        // It's a nested object - recurse into children
        for (const [childKey, childVal] of Object.entries(node || {})) {
          const childPath = [...currentPath, childKey];
          const childKeyStr = pathKey(childPath);

          // Set targetDate in meta for subsection
          if (!metaObj[childKeyStr]) {
            metaObj[childKeyStr] = {};
          }
          metaObj[childKeyStr].targetDate = deadline;

          // Recurse into children
          cascadeDeadline(childVal, deadline, childPath, metaObj);
        }
      }
    }

    // Only cascade if a date is provided (not when clearing)
    if (node && date) {
      cascadeDeadline(node, date, path, updatedMeta);
    }

    updateDashboard({
      syllabus_meta: updatedMeta,
      syllabus_tree_v2: newTree,
    });
  };

  const setSectionTargetPct = (secKey, pct) => {
    const key = pathKey([secKey]);

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

  // 1. Keep your full timestamp
  const nowISO = () => new Date().toISOString();

  // 2. setAllAtPath — YOUR ORIGINAL LOGIC (CORRECT!) + proper unmark fix
  const setAllAtPath = useCallback(
    (path, val) => {
      setDashboardState((prev) => {
        const newTree = deepClone(prev.syllabus_tree_v2 || tree);
        const node = getRefAtPath(newTree, path);

        let lastItem = null;

        const markRecursively = (n) => {
          if (Array.isArray(n)) {
            n.forEach((it) => {
              it.done = val;
              it.completedOn = val ? nowISO() : "";
              if (val) lastItem = it;
            });
            return;
          }
          for (const v of Object.values(n || {})) markRecursively(v);
        };

        markRecursively(node);

        const updates = { syllabus_tree_v2: newTree };

        if (val && lastItem) {
          updates.syllabus_lastStudied = `${
            lastItem.title
          } — ${new Date().toLocaleString("en-IN")}`;
          const streak = new Set(prev.syllabus_streak || []);
          streak.add(nowISO().slice(0, 10));
          updates.syllabus_streak = Array.from(streak);
        } else {
          updates.syllabus_lastStudied = findLastStudied(newTree);
        }

        // 🔥 Mongo sync
        updateDashboard(updates);

        return { ...prev, ...updates };
      });
    },
    [tree, updateDashboard]
  );

  // 3. markTask — single task (uses timestamp order)
  const markTask = useCallback(
    (path, idx, val) => {
      setDashboardState((prev) => {
        const newTree = deepClone(prev.syllabus_tree_v2 || tree);
        const parent = getRefAtPath(newTree, path.slice(0, -1));
        const leafKey = path[path.length - 1];
        const item = parent[leafKey][idx];

        item.done = val;
        item.completedOn = val ? nowISO() : "";

        const updates = { syllabus_tree_v2: newTree };

        if (val) {
          updates.syllabus_lastStudied = `${
            item.title
          } — ${new Date().toLocaleString("en-IN")}`;
          const streak = new Set(prev.syllabus_streak || []);
          streak.add(nowISO().slice(0, 10));
          updates.syllabus_streak = Array.from(streak);
        } else {
          updates.syllabus_lastStudied = findLastStudied(newTree);
        }

        const newState = { ...prev, ...updates };

        // ✅ IMMEDIATE SAVE - NO DEBOUNCE
        fetch(API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newState),
        })
          .then(() => {
            console.log("Mongo save → syncing dashboard");
            window.lifeOSsync?.();
          })
          .catch((err) => console.error("Mongo save failed:", err));

        return newState;
      });
    },
    [tree, API_URL]
  );

  // 4. Keep this helper (for unmarking)
  const findLastStudied = useCallback((treeRoot) => {
    let latestTitle = "";
    let latestTime = 0;

    const walk = (node) => {
      if (Array.isArray(node)) {
        node.forEach((task) => {
          if (task.done && task.completedOn) {
            const t = new Date(task.completedOn).getTime();
            if (t > latestTime) {
              latestTime = t;
              latestTitle = task.title;
            }
          }
        });
      } else {
        Object.values(node || {}).forEach(walk);
      }
    };

    walk(treeRoot);
    if (!latestTitle) return "";
    const d = new Date(latestTime);
    return `${latestTitle} — ${d.toLocaleString("en-IN")}`;
  }, []);

  // ✅ Fix: Task deadline setter with Mongo sync
  const setTaskDeadline = (path, idx, date) => {
    const newTree = deepClone(tree);

    const parent = getRefAtPath(newTree, path.slice(0, -1));
    const leafKey = path[path.length - 1];

    if (!parent || !parent[leafKey] || !parent[leafKey][idx]) return;

    parent[leafKey][idx].deadline = date;

    updateDashboard({
      syllabus_tree_v2: newTree,
    });
    window.lifeOSsync?.();
  };

  /* ======================= NOTES ======================= */
  const setNR = useCallback(
    (newNR) => {
      // Handle functional updates like setState
      if (typeof newNR === "function") {
        setDashboardState((prev) => {
          const currentNotes = prev?.syllabus_notes || {};
          const updatedNotes = newNR(currentNotes);
          const newState = {
            ...prev,
            syllabus_notes: updatedNotes,
          };

          // Save to MongoDB
          if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
          }
          saveTimeoutRef.current = setTimeout(() => {
            fetch(API_URL, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newState),
            }).catch((err) => console.error("Mongo save failed:", err));
          }, 500);

          return newState;
        });
      } else {
        updateDashboard({ syllabus_notes: newNR });
      }
    },
    [updateDashboard, API_URL]
  );

  /* ======================= EXPORT ======================= */
  function exportProgress() {
    const payload = {
      syllabus_tree_v2: tree,
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

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);

        const updated = {
          ...dashboardState,
          ...data,
        };

        setDashboardState(updated);

        fetch(API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });

        alert("✅ Syllabus imported successfully");
        window.location.reload();
      } catch {
        alert("❌ Import failed. Invalid file.");
      }
    };

    reader.readAsText(file);
  }

  /* ======================= SCROLL ======================= */
  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ======================= FILTERED ======================= */
  const filtered = useMemo(() => {
    if (!query.trim()) return tree;
    const q = query.toLowerCase();

    function filterNode(node) {
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
    }

    return filterNode(tree) || {};
  }, [tree, query]);

  /* ======================= GENERATE SMART PLAN ======================= */
  const generateSmartPlan = (availableMins) => {
    const leaves = [];

    function walk(node) {
      if (Array.isArray(node)) {
        node.forEach((it) => {
          if (!it.done) {
            leaves.push({
              title: it.title,
              deadline: it.deadline || "",
              estimate: 0.5,
            });
          }
        });
        return;
      }
      for (const v of Object.values(node || {})) walk(v);
    }

    walk(tree);

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

const todayISO = () => new Date().toISOString().split("T")[0];

async function toggleTopicDone(path, index) {
  const updatedTree = structuredClone(syllabusTree);

  // Navigate dynamically
  let node = updatedTree;
  for (const part of path) node = node[part];

  const topic = node[index];
  topic.done = !topic.done;
  topic.completedOn = topic.done ? todayISO() : "";

  setSyllabusTree(updatedTree);

  // ---- UPDATE STUDY COMPLETION TO CALENDAR ----
  setDoneMap((prev) => {
    const updated = { ...prev, [todayISO()]: true };
    syncToBackend({ wd_done: updated, syllabus_tree_v2: updatedTree });
    return updated;
  });
}



  /* ======================= RENDER ======================= */
  return (
    <div
      className="
  min-h-[80vh] rounded-xl p-2
  text-[#dceee8] dark:text-[#E6F1FF]
  bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] 
  dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
  dark:border-[#00D1FF33]
"
    >
      <header className="sticky top-0 z-40 rounded-xl mb-6 animate-fadeIn">
        <div
          className=" rounded-xl
    relative overflow-hidden
    bg-gradient-to-br from-[#0F0F0F]/95 via-[#183D3D]/90 to-[#B82132]/85
    dark:from-[#0F1622] dark:via-[#0A1F30] dark:to-[#000814]
    backdrop-blur-2xl border border-[#00D1FF]/30
    shadow-[0_0_30px_rgba(0,209,255,0.15)]
    dark:border-[#00D1FF33]
  "
        >
          {/* Animated Background Layers */}
          <div className="absolute inset-0 bg-stripes animate-stripes opacity-30" />
          <div className="absolute inset-0 bg-wave animate-wave opacity-20" />

          <div className="relative max-w-7xl mx-auto px-4 py-5 space-y-5">
            {/* Top Row: Title + Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Title */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#FF8F8F] to-[#B82132] shadow-lg shadow-[#FF8F8F]/60 animate-shimmer">
                  <span className="text-2xl font-black text-black">Code</span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#a7f3d0] via-[#00D1FF] to-[#E6F1FF] animate-shimmer bg-shimmer">
                    Jay's Web Dev-2026
                  </h1>
                  <p className="text-xs sm:text-sm text-[#a7f3d0]/80 font-medium">
                    Master Full-Stack in 365 Days
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Streak */}
                <div
                  className={`
            px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0ca56d] to-[#18c481] 
            text-black font-bold text-sm shadow-lg shadow-[#18c481]/50
            flex items-center gap-2 animate-shimmer
            ${grand.pct >= 90 ? "animate-heartbeat" : ""}
          `}
                >
                  Streak: <b>{Array.from(daySet).length}</b>
                </div>

                {/* Expand All */}
                <button
                  onClick={() => {
                    const updated = { ...dashboardState.syllabus_meta };
                    Object.keys(TREE).forEach((ep) => {
                      const key = pathKey([ep]);
                      updated[key] = { ...(updated[key] || {}), open: true };
                    });
                    updateDashboard({ syllabus_meta: updated });
                  }}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#113f30]/90 text-[#d9ebe5] border border-[#1f6a50]/60 hover:bg-[#0F3A2B] hover:border-[#00D1FF]/50 hover:shadow-[0_0_15px_rgba(0,209,255,0.3)] transition-all duration-300"
                >
                  Expand
                </button>

                {/* Collapse All */}
                <button
                  onClick={() => {
                    const updated = { ...dashboardState.syllabus_meta };
                    Object.keys(updated).forEach((k) => {
                      updated[k] = { ...updated[k], open: false };
                    });
                    updateDashboard({ syllabus_meta: updated });
                  }}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#113f30]/90 text-[#d9ebe5] border border-[#1f6a50]/60 hover:bg-[#0F3A2B] hover:border-[#00D1FF]/50 hover:shadow-[0_0_15px_rgba(0,209,255,0.3)] transition-all duration-300"
                >
                  Collapse
                </button>

                {/* Reset */}
                <button
                  onClick={() => {
                    if (!confirm("Reset ONLY syllabus progress?")) return;

                    const resetTree = normalizeTree(TREE);

                    const syllabusResetPayload = {
                      syllabus_tree_v2: resetTree,
                      syllabus_meta: {},
                      syllabus_notes: {},
                      syllabus_streak: [],
                      syllabus_lastStudied: "",
                    };

                    // ✅ Merge with existing state to preserve gym data
                    const fullPayload = {
                      ...dashboardState, // Keep gym and other data
                      ...syllabusResetPayload, // Override only syllabus fields
                    };

                    // Update local state
                    setDashboardState(fullPayload);
                    window.lifeOSsync?.();
                    // Send FULL state to backend (preserves gym data)
                    fetch(API_URL, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(fullPayload), // ✅ Changed from syllabusResetPayload
                    })
                      .then(() => {
                        alert("Syllabus progress reset ✔");
                        window.location.reload();
                      })
                      .catch(() => alert("Reset failed!"));
                  }}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#B82132] text-white hover:bg-[#a51b2a] shadow-lg transition-all duration-300"
                >
                  Reset
                </button>

                {/* Export */}
                <button
                  onClick={exportProgress}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#113f30]/90 text-[#d9ebe5] border border-[#1f6a50]/60 hover:bg-[#0F3A2B] hover:border-[#00D1FF]/50 hover:shadow-[0_0_15px_rgba(0,209,255,0.3)] transition-all duration-300"
                >
                  Export
                </button>

                {/* Import */}
                <label className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#113f30]/90 text-[#d9ebe5] border border-[#1f6a50]/60 hover:bg-[#0F3A2B] hover:border-[#00D1FF]/50 hover:shadow-[0_0_15px_rgba(0,209,255,0.3)] transition-all duration-300 cursor-pointer">
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importProgress}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#d9ebe5]">
                <span className="font-medium">
                  Progress: {grand.done} / {grand.total} topics
                </span>

                {showLastStudied && lastStudied ? (
                  <div className="flex items-center gap-2 text-green-300/90 font-medium animate-fadeIn">
                    Last studied:{" "}
                    <span className="text-green-200">{lastStudied}</span>
                  </div>
                ) : lastStudied ? (
                  <div className="text-[#a7f3d0]/60 text-sm italic">
                    Keep going!
                  </div>
                ) : (
                  <div className="text-[#a7f3d0]/60 text-sm italic">
                    No topics completed yet
                  </div>
                )}

                <span className="font-bold text-[#a7f3d0] text-lg">
                  {grand.pct}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 rounded-full bg-[#102720]/90 overflow-hidden border border-[#0B5134]/60">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />

                <div
                  className={`
              absolute inset-0 transition-all duration-1200 ease-out
              ${grand.pct >= 90 ? "animate-heartbeat" : ""}
              ${
                grand.pct < 25
                  ? "bg-gradient-to-r from-[#0f766e] to-[#22c55e]"
                  : grand.pct < 50
                  ? "bg-gradient-to-r from-[#22c55e] to-[#4ade80]"
                  : grand.pct < 75
                  ? "bg-gradient-to-r from-[#4ade80] to-[#a7f3d0]"
                  : "bg-gradient-to-r from-[#7a1d2b] to-[#ef4444] shadow-[0_0_20px_#ef444450]"
              }
            `}
                  style={{ width: `${Math.max(grand.pct, 0.5)}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-shimmer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* === Search Bar === */}
      <div className="w-full px-3 mt-4 mb-2">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search syllabus topics..."
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
      <div className="w-full px-3 mt-2 pb-6 grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* RIGHT SIDE (above on mobile) */}
        <div className="order-1 lg:order-2 lg:col-span-4 space-y-6">
          {/* 🗓️ Daily Planner */}
          <div
            className="
           rounded-2xl 
           border border-[#1a4a39]/40 
           backdrop-blur-md p-4
           shadow-[0_0_20px_rgba(0,0,0,0.2)]
           bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132]
           dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#0A1F30] dark:to-[#000814]
           dark:border-gray-800
           "
          >
            <h2 className="font-semibold mb-2">🗓️ Daily Auto Planner</h2>
            <p className="text-sm opacity-80 mb-3">
              Closest-deadline topics not yet done.
            </p>
            <DailyPlanner tree={tree} />
          </div>

          {/* 🤖 Smart Suggest */}
          <div
            className="rounded-2xl border border-[#1a4a39]/40
             backdrop-blur-md p-4 shadow-[0_0_20px_rgba(0,0,0,0.2)]-sm
             bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132]
             dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#0A1F30] dark:to-[#000814]"
          >
            <SmartSuggest generateSmartPlan={generateSmartPlan} tree={tree} />
          </div>
        </div>

        {/* LEFT SIDE — All Topics */}
        <div className="order-2 lg:order-1 lg:col-span-6 space-y-4 ">
          <main className="w-full px-0 md:px-1 space-y-4">
            {Object.entries(filtered).map(([secKey, secVal]) => (
              <SectionCard
                key={secKey}
                secKey={secKey}
                node={secVal}
                stableMeta={stableMeta}
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

      {showTopBtn && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-4 z-40 h-11 w-11 rounded-full shadow-lg bg-[#FF8F8F] text-white flex items-center justify-center text-xl"
        >
          ↑
        </button>
      )}
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

  @keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.animate-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  background-size: 200% 100%;
  animation: shimmer 4s infinite;
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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.animate-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  background-size: 200% 100%;
  animation: shimmer 4s infinite;
}

    `}
</style>;

/* ======================= Main Section ======================= */
// ------------------ TASK ITEM (must be top-level) ------------------
function TaskItem({ it, idx, path, nr, setNR, markTask, setTaskDeadline }) {
  const key = itemKey(path, idx);
  const localDateRef = useRef(null);

  const completedDate = nr[key]?.completedDate;

  return (
    <li
      key={idx}
      onClick={() => markTask(path, idx, !it.done)}
      className={`
        p-2 rounded-lg border border-[#00d1b2]/30 
        cursor-pointer transition
        ${it.done ? "opacity-80" : ""}
      `}
    >
      <div className="flex justify-between gap-2">
        {/* LEFT */}
        <div className="flex items-start gap-2">
          <div
            onClick={(e) => {
              e.stopPropagation();
              markTask(path, idx, !it.done);
            }}
            className={`
              w-5 h-5 border flex items-center justify-center cursor-pointer 
              ${it.done ? "bg-[#ED4135]/80" : "bg-[#0B2F2A]"}
            `}
          >
            {it.done && "✓"}
          </div>

          <div>
            <div className={it.done ? "line-through opacity-80" : ""}>
              {it.title}
            </div>

            {/* Show deadline if set */}
            {it.deadline && (
              <div className="text-xs opacity-70 text-[#a7f3d0]">
                ⏰ Deadline: {formatDateDDMMYYYY(it.deadline)}
              </div>
            )}

            {/* Show completed date if done */}
            {it.done && completedDate && (
              <div className="text-xs opacity-70">
                ✅ Completed: {new Date(completedDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div onClick={(e) => e.stopPropagation()} className="flex gap-2">
          <input
            type="number"
            min={0}
            step="0.25"
            value={nr[key]?.estimate !== undefined ? nr[key].estimate : 0.5}
            onChange={(e) =>
              setNR((old) => ({
                ...old,
                [key]: {
                  ...(old[key] || {}),
                  estimate: Number(e.target.value),
                },
              }))
            }
            className="w-16 text-xs rounded px-1 border border-[#00d1b2]/40 bg-black/40"
          />

          <div className="relative">
            <input
              type="date"
              ref={localDateRef}
              value={it.deadline ?? ""}
              onChange={(e) => setTaskDeadline(path, idx, e.target.value)}
              className="absolute opacity-0 pointer-events-none w-0 h-0"
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                // Position the input near the button before showing picker
                if (localDateRef.current) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  localDateRef.current.style.position = "fixed";
                  localDateRef.current.style.left = `${rect.left}px`;
                  localDateRef.current.style.top = `${rect.bottom + 5}px`;
                  localDateRef.current.style.zIndex = "9999";
                  localDateRef.current.showPicker();
                }
              }}
              className="text-xs border border-[#00d1b2]/40 px-2 py-2 flex wrap-nowrap rounded hover:bg-[#00d1b2]/10 transition"
              title={
                it.deadline
                  ? `Deadline: ${formatDateDDMMYYYY(it.deadline)}`
                  : "Set deadline"
              }
            >
              📅 {it.deadline ? formatDateDDMMYYYY(it.deadline) : "Deadline"}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

function SectionCard({
  secKey,
  node,
  stableMeta,
  nr,
  setNR,
  onSectionHeaderClick,
  setTargetDate,
  toggleOpen,
  setAllAtPath,
  markTask,
  setTaskDeadline,
}) {
  /* ======================= SETUP ======================= */

  const sectionPath = [secKey];

  // Section meta (collapse state + target date)
  const m = stableMeta[pathKey(sectionPath)] || { open: false, targetDate: "" };
  // Progress calculations
  const totals = totalsOf(node);
  const allDone = totals.total > 0 && totals.done === totals.total;

  // Date input ref
  const sectionDateRef = useRef(null);

  // Collapse animation height
  const wrapRef = useRef(null);
  const [maxH, setMaxH] = useState(0);

  /* ======================= HEIGHT ANIMATION ======================= */

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    // Measure height based on open state
    const measure = () => setMaxH(m.open ? el.scrollHeight : 0);
    measure();

    // Auto update when content size changes
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => ro.disconnect();
  }, [m.open, node, stableMeta, nr]);

  return (
    <section
      className="
        rounded-md
        border border-[#1c5b44]/40
        dark:border-[#00D1FF33]
        backdrop-blur-md
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
          rounded-md px-2 py-1.5 
          transition-all duration-300
          hover:border-[#2F6B60]
          hover:shadow-[0_0_10px_rgba(47,107,96,0.4)]
        "
      >
        {/* ======================= PROGRESS BAR ======================= */}
        <div className="absolute top-0 left-0 right-0 mx-1 h-2  rounded-full bg-[#0E1F19] overflow-hidden">
          {/* Glass Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/0 pointer-events-none" />

          {/* Progress Fill */}
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
            {/* Visual texture effects */}
            <div className="absolute inset-0 bg-stripes animate-stripes pointer-events-none" />
            <div className="absolute inset-0 bg-wave animate-wave pointer-events-none opacity-40" />
          </div>
        </div>

        {/* ======================= TITLE + CONTROLS ======================= */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-2">
          {/* LEFT: Arrow + Section Name */}
          <div className="flex items-start gap-2 min-w-0">
            <span className="text-lg select-none shrink-0">
              {m.open ? "🔽" : "▶️"}
            </span>
            <span className="font-semibold text-base sm:text-lg leading-snug break-words">
              {secKey}
            </span>
          </div>

          {/* RIGHT: Stats + Actions */}
          <div
            className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress stats */}
            <span className="shrink-0">
              {totals.done}/{totals.total} • {totals.pct}% • ~
              {totals.estimate || 0}h
            </span>

            {/* Mark All Button */}
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

            {/* Deadline Picker */}
            <div className="relative">
              {/* hidden input */}
              <input
                type="date"
                ref={sectionDateRef}
                value={m.targetDate ?? ""}
                onChange={(e) => setTargetDate(sectionPath, e.target.value)}
                className="absolute opacity-0 pointer-events-none w-0 h-0"
              />

              {/* custom button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (sectionDateRef.current) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    sectionDateRef.current.style.position = "fixed";
                    sectionDateRef.current.style.left = `${rect.left}px`;
                    sectionDateRef.current.style.top = `${rect.bottom + 5}px`;
                    sectionDateRef.current.style.zIndex = "9999";
                    sectionDateRef.current.showPicker();
                  }
                }}
                className="
                  px-2 py-1 border border-[#0B5134] rounded-md
                  bg-[#051C14] text-xs
                  hover:border-[#2F6B60] transition
                "
              >
                📅{" "}
                {m.targetDate ? formatDateDDMMYYYY(m.targetDate) : "Deadline"}
              </button>
            </div>
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
              stableMeta={stableMeta}
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
  );
}

/********************** Sub Section **********************/

function SubNode({
  name,
  node,
  path,
  stableMeta,
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
  const m = stableMeta[k] || { open: false, targetDate: "" };

  /* ======================= STATS ======================= */
  const totals = useMemo(() => totalsOf(node), [node]);
  const allDone = totals.total > 0 && totals.done === totals.total;

  /* ======================= COLLAPSE ANIMATION ======================= */
  const contentRef = useRef(null);
  const subsectionDateRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (m.open && contentRef.current) {
      setHeight(contentRef.current.scrollHeight + "px");
    } else {
      setHeight("0px");
    }
  }, [m.open, node]);

  /* ======================= AUTO-SAVE completedDate ======================= */
  const completedRef = useRef(new Set());

  useEffect(() => {
    if (!Array.isArray(node)) return;

    const updates = {};
    let hasChanges = false;

    node.forEach((it, idx) => {
      const key = itemKey(path, idx);
      const cacheKey = key; // FIX: Remove _${it.done} — cache only tracks the task, not state

      if (it.done) {
        // Item is done: set completedDate if not already set
        if (!completedRef.current.has(cacheKey) && !nr[key]?.completedDate) {
          updates[key] = {
            ...(nr[key] || {}),
            completedDate: new Date().toISOString(),
          };
          completedRef.current.add(cacheKey);
          hasChanges = true;
        }
      } else {
        // Item is undone: clear completedDate if it exists
        if (nr[key]?.completedDate) {
          const { completedDate, ...rest } = nr[key];
          updates[key] = rest;
          hasChanges = true;
        }
        // FIX: Always clear cache on unmark to allow re-set on next mark
        completedRef.current.delete(cacheKey);
      }
    });

    // Only update if there are actual changes to prevent loops
    if (hasChanges) {
      setNR((old) => ({
        ...old,
        ...updates,
      }));
    }
  }, [node, path, setNR]); // Removed 'nr' from deps to prevent loop

  /* ======================= HOUR ROLLUP ======================= */
  const hoursRollup = useMemo(() => {
    if (!Array.isArray(node)) {
      let est = 0;
      for (const [childKey, childVal] of Object.entries(node || {})) {
        if (Array.isArray(childVal)) {
          childVal.forEach((_, idx) => {
            const e = Number(
              nr[itemKey([...path, childKey], idx)]?.estimate || 0.5
            );
            est += isFinite(e) ? e : 0.5;
          });
        } else {
          Object.entries(childVal || {}).forEach(([gk, gv]) => {
            if (Array.isArray(gv)) {
              gv.forEach((_, idx) => {
                const e = Number(
                  nr[itemKey([...path, childKey, gk], idx)]?.estimate || 0.5
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
      const e = Number(nr[itemKey(path, idx)]?.estimate || 0.5);
      return s + (isFinite(e) ? e : 0.5);
    }, 0);
  }, [node, nr, path]);

  /* ======================= UI ======================= */
  return (
    <div
      className="
        rounded-xl border border-[#0B5134]/35 dark:border-gray-800
        bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F]
        dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
        text-[#d9ebe5] shadow-[0_0_15px_rgba(0,0,0,0.2)]
      "
    >
      {/* HEADER */}
      <div
        onClick={() => toggleOpen(path)}
        className="
          p-2 cursor-pointer bg-[#134039]
          hover:bg-[#00d1b2]/10
          border-l-4 border-[#D42916]
          rounded-xl
        "
      >
        <div className="flex justify-between gap-2 flex-wrap">
          <div className="flex gap-2">
            <span>{m.open ? "🔽" : "▶️"}</span>
            <span>{name}</span>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="flex gap-2 text-xs"
          >
            <span>
              {totals.done}/{totals.total} • {totals.pct}% •{" "}
              {hoursRollup.toFixed(1)}h
            </span>

            <button
              onClick={() => setAllAtPath(path, !allDone)}
              className="px-2 py-1 border border-[#00d1b2]/50 rounded hover:bg-[#0B2F2A]/80 transition"
            >
              {allDone ? "Undo all" : "Mark all"}
            </button>

            {/* Deadline Picker for Subsection */}
            <div className="relative">
              <input
                type="date"
                ref={subsectionDateRef}
                value={m.targetDate ?? ""}
                onChange={(e) => setTargetDate(path, e.target.value)}
                className="absolute opacity-0 pointer-events-none w-0 h-0"
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (subsectionDateRef.current) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    subsectionDateRef.current.style.position = "fixed";
                    subsectionDateRef.current.style.left = `${rect.left}px`;
                    subsectionDateRef.current.style.top = `${
                      rect.bottom + 5
                    }px`;
                    subsectionDateRef.current.style.zIndex = "9999";
                    subsectionDateRef.current.showPicker();
                  }
                }}
                className="
                  px-2 py-1 border border-[#0B5134] rounded-md
                  bg-[#051C14] text-xs
                  hover:border-[#2F6B60] transition
                "
              >
                📅{" "}
                {m.targetDate ? formatDateDDMMYYYY(m.targetDate) : "Deadline"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        className="transition-all overflow-hidden"
      >
        <div className="px-3 pb-3">
          {/* LEAF TASKS */}
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
            /* SUB SECTIONS (FIXED) */
            <div className="space-y-2">
              {node &&
                typeof node === "object" &&
                !Array.isArray(node) &&
                Object.entries(node).map(([childKey, childVal]) => (
                  <SubNode
                    key={childKey}
                    name={childKey}
                    node={childVal}
                    path={[...path, childKey]}
                    stableMeta={stableMeta}
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

/******************** DAILY AUTO PLANNER ********************/

function DailyPlanner({ tree }) {
  /* ======================= COLLECT ALL PENDING TASKS ======================= */

  const items = [];

  // Recursive scan through the syllabus tree
  (function walk(node, path) {
    // If it's a task list (array)
    if (Array.isArray(node)) {
      node.forEach((it) => {
        if (!it.done) {
          items.push({
            title: it.title,
            deadline: it.deadline || "",
          });
        }
      });
      return;
    }

    // If it's a nested section
    for (const [k, v] of Object.entries(node || {})) {
      walk(v, [...path, k]);
    }
  })(tree, []);

  /* ======================= SORT BY DEADLINE ======================= */

  const withDeadlines = items
    .map((i) => ({
      ...i,
      // Convert deadline string → timestamp for sorting
      d: i.deadline ? Date.parse(i.deadline) : Number.POSITIVE_INFINITY,
    }))
    .sort((a, b) => a.d - b.d) // Soonest deadline first
    .slice(0, 6); // Show top 6 tasks

  /* ======================= UI RENDER ======================= */

  return (
    <ul className="text-sm list-disc pl-5 space-y-1">
      {withDeadlines.length === 0 && (
        <li className="text-gray-400 italic text-xs">
          🎉 All tasks completed or no deadlines set.
        </li>
      )}

      {withDeadlines.map((i, idx) => (
        <li
          key={idx}
          className="
            flex items-start justify-between gap-2
            bg-black/30 rounded-md px-2 py-1
            border border-[#0B5134]/40
          "
        >
          {/* LEFT: Task title */}
          <span className="flex-1 text-[#d9ebe5] leading-snug">{i.title}</span>

          {/* RIGHT: Deadline */}
          {i.deadline && (
            <span className="text-xs text-[#a7f3d0] whitespace-nowrap">
              ⏰ {formatDateDDMMYYYY(i.deadline)}
            </span>
          )}
        </li>
      ))}
    </ul>
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

    // Sort by closest deadlines first
    const sorted = [...plan].sort((a, b) => {
      const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return da - db;
    });

    // Dynamic motivation summary
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
      p-4 shadow-[0_0_20px_rgba(0,0,0,0.2)]
      transition-all duration-300
    "
    >
      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <h3 className="font-semibold flex items-center gap-2 text-base">
          🤖 Smart Suggest
        </h3>

        <span
          className="
            text-[11px] px-3 py-1 rounded-full
            bg-[#FF8F8F] text-black font-semibold
            dark:bg-[#451013] dark:text-[#FFD1D1]
            border border-[#FF8F8F]/40 dark:border-[#FF8F8F]/30
            whitespace-nowrap sm:ml-auto
            transition-all duration-200
            hover:bg-[#ff6f6f] dark:hover:bg-[#5A1418]
          "
        >
          AI Study Planner
        </span>
      </div>

      {/* ===== Time Input ===== */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <label className="text-xs font-medium whitespace-nowrap">
          Minutes:
        </label>

        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          className="
            flex-1 px-2 py-1 text-sm rounded-md border 
            bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] 
            dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] 
            dark:border-[#00D1FF33] 
            border-[#0B5134] outline-none text-white
            min-w-[70px]
          "
        />

        <button
          onClick={handleSuggest}
          className="
            px-3 py-1.5 rounded-md 
            bg-[#FF8F8F] text-black font-semibold text-xs
            border border-[#FF8F8F]/40
            shadow-sm
            transition-all duration-200
            hover:bg-[#ff6f6f] hover:shadow-[0_0_6px_rgba(255,143,143,0.5)]
            active:scale-[0.97]
            dark:bg-[#451013] dark:text-[#FFD1D1]
            dark:hover:bg-[#5A1418]
          "
        >
          Suggest
        </button>
      </div>

      {/* ===== Motivation Summary ===== */}
      {summary && (
        <p className="text-xs italic mb-3 text-white/60 dark:text-gray-300">
          {summary}
        </p>
      )}

      {/* ===== Suggestions ===== */}
      <div className="space-y-2">
        {plan.length === 0 ? (
          <p className="text-xs opacity-70 italic">No topics suggested yet.</p>
        ) : (
          plan.map((item, i) => {
            const now = new Date();

            // Deadline urgency styling
            const urgency =
              item.deadline && new Date(item.deadline) < now
                ? "bg-red-500/15 text-red-400"
                : item.deadline &&
                  new Date(item.deadline) - now < 1000 * 60 * 60 * 24 * 2
                ? "bg-yellow-500/10 text-yellow-300"
                : "bg-green-500/10 text-green-400";

            const countdown = daysLeft(item.deadline);

            return (
              <div
                key={i}
                className={`
                  rounded-lg border border-[#0B5134] 
                  dark:border-gray-800 p-2 text-sm transition-all duration-300 
                  hover:bg-[#FF8F8F]/5
                  ${item.done ? "opacity-60 line-through" : ""}
                `}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="font-medium text-[#d9ebe5]">
                    • {item.title}
                  </span>

                  {countdown && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${urgency}`}
                    >
                      {countdown}
                    </span>
                  )}
                </div>

                {/* Time Estimate */}
                <div
                  className={`text-xs mt-1 ${
                    item.done ? "opacity-40" : "opacity-80"
                  }`}
                >
                  ⏱ ~{Math.round(item.estimate * 60)} mins
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ===== Footer ===== */}
      <div
        className="
        mt-4 text-xs text-white/60 dark:text-gray-400 
        border-t border-[#0B5134] dark:border-gray-800 pt-2 
        flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2
      "
      >
        <span>
          {plan.length > 0
            ? `Remaining buffer: ${remaining} mins`
            : "Enter available time to get a plan!"}
        </span>

        {plan.length > 0 && (
          <button className="text-[#FF8F8F] font-medium hover:underline text-xs whitespace-nowrap">
            Start Focus Mode 🚀
          </button>
        )}
      </div>
    </div>
  );
}
