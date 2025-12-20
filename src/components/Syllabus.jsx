import { useEffect, useMemo, useRef, useState, useCallback } from "react";
const LOCAL_KEY = "wd_dashboard_state";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // In your component:
import { createPortal } from "react-dom";

//
// ✅ ADD THIS JUST BELOW LOCAL_KEY
//
function walkTree(tree, path, cb, currentPath = []) {
  // If full path reached, start walking children
  if (currentPath.length === path.length) {
    cb(tree, currentPath);
    return;
  }

  const nextKey = path[currentPath.length];
  if (tree && tree[nextKey] !== undefined) {
    walkTree(tree[nextKey], path, cb, [...currentPath, nextKey]);
  }
}

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

// Stabilize meta reference to prevent re-renders

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
          .toLowerCase(), // normalize casing
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

/**
 * Normalizes your entire syllabus TREE
 * Converts all sections into nested structures
 */
// keep for compatibility but delegate to normalized version
const normalizeWholeTree = (src) => normalizeTree(src);

function resetSyllabusProgress() {
  // 1️⃣ Clone current syllabus from state
  const cloned = structuredClone(dashboardState.syllabus_tree_v2);

  // 2️⃣ Walk and reset progress
  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach((item) => {
        item.done = false;
        item.deadline = "";
        item.completedOn = "";
      });
      return;
    }

    if (node && typeof node === "object") {
      Object.values(node).forEach(walk);
    }
  };

  walk(cloned);

  // 3️⃣ Save back to state
  setDashboardState((prev) => ({
    ...prev,
    syllabus_tree_v2: cloned,
  }));
}

/* ======================= MAIN ======================= */
export default function Syllabus({
  dashboardState,
  setDashboardState,
  updateDashboard,
}) {
  // ---------------- MONGO CONFIG ----------------
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://fitness-backend-laoe.onrender.com/api/state";

  // ⛑ Guard: prevent crash before state arrives
  if (!dashboardState) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#0A0F1C] overflow-hidden">
        <div className="flex flex-col items-center gap-6">
          {/* Animated Icons */}
          <div className="flex space-x-4 text-5xl">
            <span className="animate-bounce" style={{ animationDelay: "0s" }}>
              💪
            </span>
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
              🏋️
            </span>
            <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
              🔥
            </span>
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-[#CFE8E1] animate-pulse">
              Loading your fitness journey...
            </h2>
            <div className="flex items-center justify-center gap-1">
              <div
                className="w-2 h-2 bg-[#00d1b2] rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-2 h-2 bg-[#00d1b2] rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-[#00d1b2] rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ======================= SYLLABUS TREE (SAFE + FIXED) ======================= */

  // Tree is stored ONCE to prevent infinite re-renders, recursion, or re-normalizing.
  const treeRef = useRef(null);

  // Initialize once (TREE is only fallback)
  if (!treeRef.current) {
    treeRef.current = structuredClone(
      dashboardState?.syllabus_tree_v2 &&
        Object.keys(dashboardState.syllabus_tree_v2).length > 0
        ? dashboardState.syllabus_tree_v2
        : TREE,
    );
  }

  // This is now the final stable syllabus tree for the UI.
  const tree = treeRef.current;

  // useEffect(() => {
  //   if (
  //     dashboardState?.syllabus_tree_v2 &&
  //     typeof dashboardState.syllabus_tree_v2 === "object" &&
  //     Object.keys(dashboardState.syllabus_tree_v2).length > 0
  //   ) {
  //     treeRef.current = structuredClone(dashboardState.syllabus_tree_v2);
  //   }
  // }, [dashboardState?.syllabus_tree_v2]);

  useEffect(() => {
    if (
      dashboardState?.syllabus_tree_v2 &&
      typeof dashboardState.syllabus_tree_v2 === "object"
    ) {
      treeRef.current = structuredClone(dashboardState.syllabus_tree_v2);
      forceRender((v) => v + 1);
    }
  }, [dashboardState?.syllabus_tree_v2]);

  // this creates a dummy state update function to force redraw
  const [, forceRender] = useState(0);

  // ========= FIXED SYLLABUS TOGGLE (WORKING + LOCAL + BACKEND SAVE) =========
  const toggleTask = (path) => {
    // point to treeRef version (never re-created)
    let ref = tree;

    // go through nested keys
    for (let i = 0; i < path.length - 1; i++) {
      ref = ref[path[i]];
    }

    const lastKey = path[path.length - 1];

    // toggle
    ref[lastKey].done = !ref[lastKey].done;

    // prepare updated state
    const updated = {
      ...dashboardState,
      syllabus_tree_v2: tree,
    };

    // 1️⃣ React state
    updateDashboard({ syllabus_tree_v2: tree });

    // 2️⃣ Local save
    try {
      window.localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("⚠️ localStorage save failed (toggleTask):", err);
    }

    // 3️⃣ Debounced backend save
    clearTimeout(window._syllabusUpdateTimer);
    window._syllabusUpdateTimer = setTimeout(() => {
      fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      }).catch((err) => console.error("❌ Save failed:", err));
    }, 400);
  };

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

  useEffect(() => {
    if (!dashboardState) return;

    const hasTree =
      dashboardState.syllabus_tree_v2 &&
      Object.keys(dashboardState.syllabus_tree_v2).length > 0;

    if (!hasTree) {
      console.log("🌱 Seeding syllabus from code");

      updateDashboard({
        syllabus_tree_v2: structuredClone(TREE),
        syllabus_notes: {},
        syllabus_streak: [],
        syllabus_meta: {},
      });
    }
  }, [dashboardState]);


  /* ======================= CLEANUP TIMEOUT ======================= */
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  /* ======================= AUTO SEED MONGO ======================= */
  useEffect(() => {
    // Only seed if we confirmed there's no backend data AND no localStorage
    const hasLocalData = window.localStorage.getItem(LOCAL_KEY);

    if (!dashboardState?.syllabus_tree_v2 && !hasLocalData) {
      console.log("🌱 First-time setup → storing syllabus...");

      const seededTree = structuredClone(TREE);

      updateDashboard({
        syllabus_tree_v2: seededTree,
      });
    }
  }, [dashboardState?.syllabus_tree_v2]); // Only run when tree state changes

  /* ======================= LAST STUDIED AUTO-HIDE ======================= */
  useEffect(() => {
    if (!lastStudied) return;

    setShowLastStudied(true);

    const timer = setTimeout(
      () => {
        setShowLastStudied(false);
      },
      LAST_STUDIED_HIDE_MINUTES * 60 * 1000,
    );

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

  const grand = useMemo(
    () => totalsOf(dashboardState?.syllabus_tree_v2 || TREE, new WeakSet()),
    [dashboardState?.syllabus_tree_v2],
  );

  /* ======================= ACTIONS ======================= */

  // ✅ Stable Toggle (does not break after Mongo re-render)
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
          updatedAt: new Date().toISOString(), // ✅ Timestamp for tracking
        };
      });
    },
    [], // ✅ Clean - no dependencies
  );

  // alias for Section header click
  const onSectionHeaderClick = (path) => {
    toggleOpen(path);
  };

  // =========================================================
  // 🔥 FINAL FIXED: Set deadline on section + cascade to tasks
  // =========================================================
  // ------------- Replace setTargetDate with this -------------
  const setTargetDate = (path, date) => {
    const key = pathKey(path);

    // 1) Build updated meta starting from current meta
    const updatedMeta = { ...meta };

    // Helper to set or delete targetDate on a meta entry
    const setMetaForKey = (k, d) => {
      if (d) {
        updatedMeta[k] = { ...(updatedMeta[k] || {}), targetDate: d };
      } else {
        // clear targetDate for this meta key
        if (updatedMeta[k]) {
          const copy = { ...updatedMeta[k] };
          delete copy.targetDate;
          // if copy is empty object, keep it empty (optional) or delete key:
          if (Object.keys(copy).length === 0) {
            delete updatedMeta[k];
          } else {
            updatedMeta[k] = copy;
          }
        }
      }
    };

    // 2) Prepare new notes (syllabus_notes) from existing nr
    const newNotes = { ...(nr || {}) };

    // 3) Cascade function: update meta for every nested subsection AND update notes for every topic
    const cascade = (node, currentPath) => {
      const currentKey = pathKey(currentPath);
      // update meta for this current subsection (set or clear)
      setMetaForKey(currentKey, date);

      if (Array.isArray(node)) {
        // it's a list of topics -> update their note entries
        node.forEach((_, idx) => {
          const itemK = itemKey(currentPath, idx);
          const existing = newNotes[itemK] || {};
          if (date) {
            // set/replace deadline
            newNotes[itemK] = { ...existing, deadline: date };
          } else {
            // clear deadline key only
            const clone = { ...existing };
            if (clone.hasOwnProperty("deadline")) delete clone.deadline;
            if (Object.keys(clone).length === 0) {
              // remove empty note to avoid clutter
              if (newNotes.hasOwnProperty(itemK)) delete newNotes[itemK];
            } else {
              newNotes[itemK] = clone;
            }
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

    const subtree = getRefAtPath(tree, path);
    if (subtree) cascade(subtree, path);

    // 4) Persist changes (updateDashboard updates dashboardState so UI re-renders)
    updateDashboard({
      syllabus_meta: updatedMeta,
      syllabus_notes: newNotes,
    });
  };

  // =========================================================
  // 🔹 Set section target percent
  // =========================================================
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

  // =========================================================
  // 🔥 Mark / Unmark ALL tasks in a section
  // =========================================================
  const setAllAtPath = (path, val) => {
    const newTree = deepClone(treeRef.current);
    const node = getRefAtPath(newTree, path);

    let lastItem = null;

    (function mark(n) {
      if (!n) return;

      if (Array.isArray(n)) {
        n.forEach((it) => {
          if (typeof it === "object" && it.title) {
            it.done = val;
            it.completedOn = val ? todayISO() : "";
            if (val) lastItem = it;
          }
        });
        return;
      }

      for (const v of Object.values(n)) {
        if (typeof v === "object") mark(v);
      }
    })(node);

    const updates = { syllabus_tree_v2: newTree };

    if (val && lastItem) {
      updates.syllabus_lastStudied = `${
        lastItem.title
      } — ${new Date().toLocaleString("en-IN")}`;
      updates.syllabus_streak = Array.from(new Set([...daySet, todayISO()]));
    }

    updateDashboard(updates);

    treeRef.current = newTree;
    forceRender((n) => n + 1);
  };

  // =========================================================
  // 🔥 Mark single task
  // =========================================================
  const markTask = (path, idx, val) => {
    const newTree = deepClone(treeRef.current);

    const parent = getRefAtPath(newTree, path.slice(0, -1));
    const leafKey = path[path.length - 1];
    const item = parent[leafKey][idx];

    item.done = val;
    item.completedOn = val ? todayISO() : "";

    const updates = { syllabus_tree_v2: newTree };

    if (val) {
      updates.syllabus_lastStudied = `${
        item.title
      } — ${new Date().toLocaleString("en-IN")}`;
      updates.syllabus_streak = Array.from(new Set([...daySet, todayISO()]));
    }

    treeRef.current = newTree;
    forceRender((x) => x + 1);

    updateDashboard(updates);
  };

  // =========================================================
  // 🔥 FIXED: Task deadline setter (updates NR, not just tree)
  // =========================================================
  // ------------- Replace setTaskDeadline with this -------------
  const setTaskDeadline = (path, idx, date) => {
    const itemK = itemKey(path, idx);
    const updatedNotes = { ...(nr || {}) };

    const existing = updatedNotes[itemK] || {};

    if (date) {
      updatedNotes[itemK] = { ...existing, deadline: date };
    } else {
      // clear only the deadline key
      const clone = { ...existing };
      if (clone.hasOwnProperty("deadline")) delete clone.deadline;
      if (Object.keys(clone).length === 0) {
        // remove empty note
        if (updatedNotes.hasOwnProperty(itemK)) delete updatedNotes[itemK];
      } else {
        updatedNotes[itemK] = clone;
      }
    }

    updateDashboard({
      syllabus_notes: updatedNotes,
    });
  };

  /* ======================= NOTES ======================= */
  const setNR = useCallback(
    (newNR) => {
      // If newNR is a function (same behavior as setState callback)
      if (typeof newNR === "function") {
        setDashboardState((prev) => {
          const currentNotes = prev?.syllabus_notes || {};
          const updatedNotes = newNR(currentNotes);

          const newState = {
            ...prev,
            syllabus_notes: updatedNotes,
          };

          // 1️⃣ Save to local storage
          try {
            window.localStorage.setItem(LOCAL_KEY, JSON.stringify(newState));
          } catch (err) {
            console.error("⚠️ localStorage save failed (setNR callback):", err);
          }

          // 2️⃣ Debounce + save to backend
          if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

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
        // If a normal object was passed → delegate to updateDashboard()
        updateDashboard({ syllabus_notes: newNR });
      }
    },
    [updateDashboard, API_URL],
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

        updateDashboard({ syllabus_tree_v2: tree });

        try {
          window.localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
        } catch (err) {
          console.error("⚠️ localStorage save failed (importProgress):", err);
        }

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
          (it.title || "").toLowerCase().includes(q),
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

    function walk(node, path = []) {
      if (Array.isArray(node)) {
        node.forEach((it, idx) => {
          if (!it.done) {
            // Create itemKey to look up deadline in notes
            const itemK = itemKey(path, idx);
            const noteData = nr[itemK]; // Get note data with deadline

            leaves.push({
              title: it.title,
              deadline: noteData?.deadline || null, // ✅ Get deadline from notes
              estimate: 0.5,
            });
          }
        });
        return;
      }
      for (const [key, v] of Object.entries(node || {})) {
        walk(v, [...path, key]); // ✅ Pass path for itemKey
      }
    }

    walk(tree, []); // ✅ Start with empty path

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

  /* ======================= RENDER ======================= */
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
      <header
        className="
    sticky top-0 z-40 rounded-xl
    bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132]
    dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#0A1F30] dark:to-[#000814]
    backdrop-blur-xl
    border border-[#0B5134]/60
    shadow-[0_0_15px_rgba(0,0,0,0.35)]
    dark:border-[#00D1FF33]
    text-[#E6F1FF]
  "
      >
        <div className="max-w-6xl mx-auto px-3 py-4 space-y-4">
          {/* 🔹 Top Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* LEFT — Title */}
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#d9ebe5]">
              Syllabus Jay's Web Dev-2026
            </h1>

            {/* RIGHT — Buttons */}
            <div className="flex flex-wrap justify-end gap-2">
              {/* 🔥 Streak */}
              <span
                className="
          px-3 py-1.5 rounded-xl
          bg-gradient-to-r from-[#0ca56d] to-[#18c481]
          border border-[#0B5134]/60
          text-[14px] font-semibold text-black
        "
              >
                🔥 Streak: <b>{Array.from(daySet).length}</b> days
              </span>
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
                className="px-3 py-1.5 rounded-xl text-sm 
          bg-[#113f30]/80 text-[#d9ebe5]
          border border-[#1f6a50]/40
          hover:bg-[#0F3A2B] transition"
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
                className="px-3 py-1.5 rounded-xl text-sm 
          bg-[#113f30]/80 text-[#d9ebe5]
          border border-[#1f6a50]/40
          hover:bg-[#0F3A2B] transition"
              >
                Collapse
              </button>
              {/* Reset */}
              <button
                onClick={async () => {
                  if (
                    !confirm(
                      "⚠️ Reset ALL syllabus progress? This CANNOT be undone!",
                    )
                  )
                    return;

                  try {
                    // Step 1: Create completely fresh tree - USE TREE DIRECTLY
                    const resetTree = structuredClone(TREE);

                    // Step 2: Read current backend state
                    const getResponse = await fetch(API_URL, {
                      method: "GET",
                      headers: { "Content-Type": "application/json" },
                    });

                    const currentBackend = await getResponse.json();
                    console.log("📥 Current backend:", currentBackend);

                    // Step 3: Build new state keeping only gym data
                    const newState = {
                      ...currentBackend,
                      syllabus_tree_v2: resetTree,
                      syllabus_meta: {},
                      syllabus_notes: {},
                      syllabus_nr: {},
                      syllabus_streak: [],
                      syllabus_lastStudied: "",
                    };

                    console.log("📤 Sending to backend:", newState);

                    // Step 4: Send to backend with PUT
                    const putResponse = await fetch(API_URL, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(newState),
                    });

                    if (!putResponse.ok) {
                      throw new Error(`Backend returned ${putResponse.status}`);
                    }

                    console.log("✅ Backend updated successfully");

                    // Step 5: Verify it saved
                    const verifyResponse = await fetch(API_URL, {
                      method: "GET",
                      headers: { "Content-Type": "application/json" },
                    });
                    const verified = await verifyResponse.json();
                    console.log("✅ Verified backend:", verified);

                    // Step 6: Clear ALL localStorage
                    localStorage.clear();

                    // Step 7: Show success and reload
                    alert("✅ RESET COMPLETE! Page will reload now.");

                    // Hard reload bypassing cache
                    window.location.href =
                      window.location.href + "?t=" + Date.now();
                  } catch (err) {
                    console.error("❌ Reset failed:", err);
                    alert(
                      "Reset failed! Check console for details.\n\nError: " +
                        err.message,
                    );
                  }
                }}
                className="px-3 py-1.5 rounded-xl text-sm bg-[#B82132] text-white shadow-md hover:bg-[#a51b2a] transition"
              >
                Reset
              </button>

              {/* Export */}
              <button
                onClick={exportProgress}
                className="px-3 py-1.5 rounded-xl text-sm text-[#d9ebe5]
          bg-[#113f30]/80 border border-[#1f6a50]/40
          hover:bg-[#0F3A2B] transition"
              >
                📤 Export
              </button>
              {/* Import */}
              <label
                className="px-3 py-1.5 rounded-xl text-sm cursor-pointer
          bg-[#113f30]/80 border border-[#1f6a50]/40 text-[#d9ebe5]
          hover:bg-[#0F3A2B] transition"
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

          {/* 🔹 Progress Section */}
          <div className="pt-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between text-xs text-[#d9ebe5] gap-1">
              <span className="font-medium">
                Progress: {grand.done}/{grand.total}
              </span>

              {showLastStudied &&
                (lastStudied ? (
                  <div className="text-green-300/90 flex items-center gap-1">
                    📘 <span>Last studied:</span>
                    <span className="font-medium text-green-200">
                      {lastStudied}
                    </span>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    📭 No topics completed yet.
                  </div>
                ))}

              <span className="font-semibold text-[#a7f3d0]">{grand.pct}%</span>
            </div>

            {/* ✅ Improved Progress Bar */}
            <div className="relative mt-2 h-2.5 rounded-full bg-[#102720] overflow-hidden">
              {/* Background glow layer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

              {/* Progress Fill */}
              <div
                className={`
            h-full rounded-full transition-all duration-700 ease-out
            ${
              grand.pct < 25
                ? "bg-gradient-to-r from-[#0f766e] to-[#22c55e] shadow-[0_0_6px_#22c55e]"
                : grand.pct < 50
                  ? "bg-gradient-to-r from-[#22c55e] to-[#4ade80] shadow-[0_0_6px_#4ade80]"
                  : grand.pct < 75
                    ? "bg-gradient-to-r from-[#4ade80] to-[#a7f3d0] shadow-[0_0_6px_#a7f3d0]"
                    : "bg-gradient-to-r from-[#7a1d2b] to-[#ef4444] shadow-[0_0_8px_#ef4444]"
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
      </header>

      {/* === Search Bar === */}
      <div className="w-full px-3 mt-4 mb-2">
        <div className="max-w-6xl mx-auto">
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

            <DailyPlanner tree={tree} nr={nr} />
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
            {Object.entries(filtered)
              .filter(([k]) => k !== "__normalized")
              .map(([secKey, node]) => (
                <SectionCard
                  key={secKey}
                  secKey={secKey}
                  node={node}
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
  const completedDate = nr[key]?.completedDate;
  const deadline = nr[key]?.deadline;

  // Date picker state
  const buttonRef = useRef(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });

  // Calculate days difference between completion and deadline
  const getDaysDifference = () => {
    if (!it.done || !completedDate || !deadline) return null;

    const completed = new Date(completedDate);
    const due = new Date(deadline);
    const diffTime = due.getTime() - completed.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const daysDiff = getDaysDifference();

  return (
    <>
      <li
        className={`
          p-2.5 rounded-lg border transition-all duration-200
          ${
            it.done
              ? "border-[#00d1b2]/20 bg-[#0B2F2A]/30 opacity-90"
              : "border-[#00d1b2]/40 bg-[#0B2F2A]/50 hover:bg-[#0B2F2A]/70 hover:border-[#00d1b2]/60"
          }
        `}
      >
        {/* MAIN ROW */}
        <div className="flex items-center justify-between gap-2">
          {/* LEFT: Checkbox + Title */}
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
                    ? "line-through opacity-70 text-gray-400 dark:text-gray-500"
                    : "text-[#d9ebe5]"
                }
              `}
            >
              {it.title}
            </div>
          </div>

          {/* RIGHT: Compact Controls */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 shrink-0"
          >
            {/* Estimate Hours - Compact */}
            <input
              type="number"
              min={0}
              max={100}
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
              onClick={(e) => e.stopPropagation()}
              className="
                w-12 text-xs rounded px-1.5 py-1
                border border-[#00d1b2]/40 
                bg-[#051C14] text-[#d9ebe5]
                hover:border-[#00d1b2]/60
                focus:outline-none focus:ring-1 focus:ring-[#00d1b2]
                transition text-center
              "
              title="Estimated hours"
            />
            <span className="text-[10px] text-gray-500">h</span>

            {/* Date Picker Button */}
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
                text-[11px] border rounded
                px-2 py-1
                border-[#00d1b2]/40 bg-[#051C14] text-[#d9ebe5]
                hover:border-[#00d1b2]/60
                transition cursor-pointer
                whitespace-nowrap
              "
              title={
                deadline
                  ? `Deadline: ${formatDateDDMMYYYY(deadline)}`
                  : "Set deadline"
              }
            >
              📅 {deadline ? formatDateDDMMYYYY(deadline) : "Set"}
            </button>

            {/* Clear Deadline Button */}
            {deadline && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTaskDeadline(path, idx, "");
                }}
                className="
                  w-6 h-6 flex items-center justify-center
                  border border-red-500/50 rounded
                  bg-red-900/20 text-xs text-red-400
                  hover:bg-red-900/40 hover:border-red-500
                  transition-colors
                "
                title="Clear deadline"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* META ROW - FIXED with consistent space and smooth transitions */}
        {(deadline || (it.done && completedDate)) && (
          <div className="mt-2 pl-6 text-[10px] transition-all duration-200">
            {/* Deadline Display - Only show if NOT completed */}
            {deadline && !it.done && (
              <div className="flex items-center gap-1 text-[#a7f3d0] dark:text-[#6ee7b7]">
                <span>⏰</span>
                <span>Due: {formatDateDDMMYYYY(deadline)}</span>
              </div>
            )}

            {/* Completed Status with Days Before/After Deadline */}
            {it.done && completedDate && (
              <div className="flex items-center gap-1 flex-wrap">
                <span>✅</span>
                <span className="text-emerald-400 dark:text-emerald-300">
                  Completed on {formatDateDDMMYYYY(completedDate)}
                </span>

                {/* Show days difference if deadline exists */}
                {deadline && daysDiff !== null && (
                  <span
                    className={`
          ml-1 font-semibold
          ${
            daysDiff > 0
              ? "text-green-400"
              : daysDiff < 0
                ? "text-red-400"
                : "text-yellow-400"
          }
        `}
                  >
                    {daysDiff > 0
                      ? `(${daysDiff} day${
                          daysDiff !== 1 ? "s" : ""
                        } before deadline)`
                      : daysDiff < 0
                        ? `(${Math.abs(daysDiff)} day${
                            Math.abs(daysDiff) !== 1 ? "s" : ""
                          } after deadline)`
                        : "(on deadline day)"}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </li>

      {/* ======================= COMPACT DATEPICKER PORTAL ======================= */}
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
                selected={deadline ? new Date(deadline) : null}
                onChange={(date) => {
                  const formatted = date
                    ? date.toISOString().split("T")[0]
                    : "";
                  setTaskDeadline(path, idx, formatted);
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
          document.body,
        )}
    </>
  );
}

// ------------------ SECTION CARD ------------------
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
  const m = stableMeta[pathKey(sectionPath)] || {
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
              nr[itemKey([secKey, childKey], idx)]?.estimate || 0.5,
            );
            est += isFinite(e) ? e : 0.5;
          });
        } else {
          Object.entries(childVal || {}).forEach(([gk, gv]) => {
            if (Array.isArray(gv)) {
              gv.forEach((_, idx) => {
                const e = Number(
                  nr[itemKey([secKey, childKey, gk], idx)]?.estimate || 0.5,
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
  }, [m.open, node, stableMeta, nr]);

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
                  const formatted = date
                    ? date.toISOString().split("T")[0]
                    : "";
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
          document.body,
        )}
    </>
  );
}

// ------------------ SUB NODE (SECTION or TASK LIST) ------------------//
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
  const buttonRef = useRef(null);
  const [height, setHeight] = useState("0px");

  // Portal state for date picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!showDatePicker) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;

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
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("orientationchange", updatePosition);

    // Recalc immediately
    updatePosition();

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("orientationchange", updatePosition);
    };
  }, [showDatePicker]);

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
      const cacheKey = `${key}_${it.done}`;

      if (it.done) {
        // Item is done: set completedDate if not already set
        if (!nr[key]?.completedDate) {
          updates[key] = {
            ...(nr[key] || {}),
            completedDate: new Date().toISOString(),
          };
          hasChanges = true;
        }
      } else {
        // Item is undone: clear completedDate if it exists
        if (nr[key]?.completedDate) {
          const { completedDate, ...rest } = nr[key];
          updates[key] = Object.keys(rest).length > 0 ? rest : undefined;
          hasChanges = true;
        }
      }
    });

    // Only update if there are actual changes to prevent loops
    if (hasChanges) {
      setNR((old) => {
        const newNR = { ...old };
        Object.entries(updates).forEach(([key, value]) => {
          if (value === undefined) {
            delete newNR[key];
          } else {
            newNR[key] = value;
          }
        });
        return newNR;
      });
    }
  }, [node, path, setNR, nr]);

  /* ======================= HOUR ROLLUP ======================= */
  const hoursRollup = useMemo(() => {
    if (!Array.isArray(node)) {
      let est = 0;
      for (const [childKey, childVal] of Object.entries(node || {})) {
        if (Array.isArray(childVal)) {
          childVal.forEach((_, idx) => {
            const e = Number(
              nr[itemKey([...path, childKey], idx)]?.estimate || 0.5,
            );
            est += isFinite(e) ? e : 0.5;
          });
        } else {
          Object.entries(childVal || {}).forEach(([gk, gv]) => {
            if (Array.isArray(gv)) {
              gv.forEach((_, idx) => {
                const e = Number(
                  nr[itemKey([...path, childKey, gk], idx)]?.estimate || 0.5,
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
    <>
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
            <div className="flex gap-2 items-center">
              <span>{m.open ? "🔽" : "▶️"}</span>
              <span>{name}</span>
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="flex flex-wrap gap-2 text-xs items-center"
            >
              <span className="whitespace-nowrap">
                {totals.done}/{totals.total} • {totals.pct}% •{" "}
                {hoursRollup.toFixed(1)}h
              </span>

              <button
                onClick={() => setAllAtPath(path, !allDone)}
                className="px-2 py-1 border border-[#00d1b2]/50 rounded hover:bg-[#0B2F2A]/80 transition whitespace-nowrap"
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
          whitespace-nowrap
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
                    setTargetDate(path, "");
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

      {/* ======================= DYNAMIC THEME DATEPICKER ======================= */}
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
                  const formatted = date
                    ? date.toISOString().split("T")[0]
                    : "";
                  setTargetDate(path, formatted);
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
          document.body,
        )}
    </>
  );
}

/******************** DAILY AUTO PLANNER ********************/

function DailyPlanner({ tree, nr }) {
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
   *   FINAL LOGIC (CORRECT)
   * ------------------------------- */

  const uncompleted = tasks.filter((t) => !t.done);

  // 1️⃣ If NO uncompleted tasks → All Clear
  if (uncompleted.length === 0) {
    return (
      <div className="w-full text-center py-10 sm:py-12 px-4">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="text-lg font-semibold text-emerald-100">All Clear!</h3>
        <p className="text-gray-400 text-sm">Everything is complete</p>
      </div>
    );
  }

  // 2️⃣ If deadlines exist → show closest deadline tasks
  const withDeadlines = uncompleted
    .filter((t) => t.hasDeadline)
    .sort((a, b) => a.d - b.d)
    .slice(0, 6);

  // 3️⃣ If no deadlines → show uncompleted in natural order (first 6)
  const toShow =
    withDeadlines.length > 0 ? withDeadlines : uncompleted.slice(0, 6);

  return (
    <div className="w-full">
      {/* Header with stats on right */}
      <div className="flex items-start justify-between mb-3">
        {/* Small subtitle on left */}
        <p className="text-sm opacity-80 mb-3">
          Closest-deadline topics not yet done.
        </p>

        {/* Task count on right */}
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

      {/* Compact Task List */}
      <ul className="space-y-1.5">
        {toShow.map((item, idx) => {
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
            <li
              key={idx}
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
              {/* Thin Accent Bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-0.5 ${progressColor} opacity-60 group-hover:opacity-100 transition-opacity`}
              />

              <div className="p-2 pl-2.5">
                {/* Single Row: Icon + Title + Date + Badge */}
                <div className="flex items-center justify-between gap-2">
                  {/* Left: Icon + Title */}
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="text-sm shrink-0">{urgencyIcon}</span>
                    <span className="text-xs text-[#d9ebe5] font-medium truncate group-hover:text-white transition-colors">
                      {item.title}
                    </span>
                  </div>

                  {/* Right: Date + Days Badge */}
                  {deadline && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Date */}
                      <div className="flex items-center gap-0.5 opacity-70">
                        <span className="text-[9px]">📆</span>
                        <span className="text-[9px] text-gray-300 font-medium hidden sm:inline">
                          {formatDateDDMMYYYY(item.deadline)}
                        </span>
                      </div>

                      {/* Days Badge */}
                      {daysLeft && (
                        <span
                          className={`
                          text-[9px] font-bold px-1.5 py-0.5 rounded
                          border ${urgencyBadge}
                          whitespace-nowrap
                          ${urgencyBadge.includes("red") ? "animate-pulse" : ""}
                        `}
                        >
                          {daysLeft}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Thin Progress Bar (optional, only for normal tasks) */}
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
                              const progress = Math.min(
                                95,
                                Math.max(
                                  5,
                                  ((maxDays - daysRemaining) / maxDays) * 100,
                                ),
                              );
                              return progress;
                            })()}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </li>
          );
        })}
      </ul>

      {/* Empty state */}
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
      }),
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
      p-5 shadow-[0_0_20px_rgba(0,0,0,0.2)]
      transition-all duration-300
      hover:shadow-[0_0_30px_rgba(255,143,143,0.15)]
    "
    >
      {/* ===== Modern Header ===== */}
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
          transition-all duration-200
          hover:scale-105 hover:shadow-lg
          cursor-default
        "
        >
          ✨ AI Powered
        </span>
      </div>

      {/* ===== Modern Input Section ===== */}
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
              placeholder="120"
              className="
              w-full px-4 py-2.5 text-sm rounded-xl border 
              bg-white/5 dark:bg-black/30
              dark:border-[#00D1FF33] 
              border-[#0B5134] outline-none text-white
              focus:ring-2 focus:ring-[#FF8F8F]/50 dark:focus:ring-[#451013]
              transition-all duration-200
              placeholder:text-gray-500
            "
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
              minutes
            </span>
          </div>

          <button
            onClick={handleSuggest}
            className="
            px-5 py-2.5 rounded-xl 
            bg-gradient-to-r from-[#FF8F8F] to-[#ff6f6f] text-black font-bold text-sm
            dark:from-[#451013] dark:to-[#5A1418] dark:text-[#FFD1D1]
            border border-[#FF8F8F]/40
            shadow-lg
            transition-all duration-200
            hover:scale-105 hover:shadow-[0_0_15px_rgba(255,143,143,0.5)]
            active:scale-95
            whitespace-nowrap
            flex items-center gap-2
          "
          >
            <span>Generate</span>
            <span className="text-base">✨</span>
          </button>
        </div>
      </div>

      {/* ===== Motivation Summary ===== */}
      {summary && (
        <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs italic text-white/80 dark:text-gray-300">
            💡 {summary}
          </p>
        </div>
      )}

      {/* ===== Modern Suggestions List ===== */}
      <div className="space-y-2.5">
        {plan.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/5 flex items-center justify-center">
              <span className="text-3xl">📚</span>
            </div>
            <p className="text-sm font-medium text-gray-400 mb-1">
              No suggestions yet
            </p>
            <p className="text-xs text-gray-500">
              Enter your available time to get started
            </p>
          </div>
        ) : (
          plan.map((item, i) => {
            const now = new Date();
            // Calculate urgency ONCE
            const urgency =
              item.deadline && new Date(item.deadline) < now
                ? {
                    bg: "bg-red-500/20",
                    text: "text-red-400",
                    border: "border-red-600/50",
                    barColor: "bg-red-500", // For vertical bar
                  }
                : item.deadline &&
                    new Date(item.deadline) - now < 1000 * 60 * 60 * 24 * 2
                  ? {
                      bg: "bg-yellow-500/20",
                      text: "text-yellow-300",
                      border: "border-yellow-600/50",
                      barColor: "bg-yellow-500", // For vertical bar
                    }
                  : {
                      bg: "bg-emerald-500/20",
                      text: "text-emerald-400",
                      border: "border-emerald-600/50",
                      barColor: "bg-emerald-500", // For vertical bar
                    };
            const countdown = daysLeft(item.deadline);

            return (
              <div
                key={i}
                className={`
        group relative
        rounded-xl border overflow-hidden
        dark:border-gray-800 p-3 text-sm
        transition-all duration-300 
        hover:scale-[1.02] hover:shadow-lg
        ${item.done ? "opacity-50 line-through" : "bg-white/5"}
        ${urgency.border}
      `}
              >
                {/* Accent indicator - USE urgency.barColor */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${urgency.barColor}`}
                />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 pl-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="text-base mt-0.5">📖</span>
                      <span className="font-semibold text-[#d9ebe5] group-hover:text-white transition-colors">
                        {item.title}
                      </span>
                    </div>

                    {/* Time Estimate with icon */}
                    <div className="flex items-center gap-2 pl-7">
                      <span
                        className={`text-xs ${
                          item.done ? "opacity-40" : "opacity-70"
                        } flex items-center gap-1`}
                      >
                        <span>⏱</span>
                        <span>~{Math.round(item.estimate * 60)} minutes</span>
                      </span>
                    </div>
                  </div>

                  {/* Countdown Badge */}
                  {countdown && (
                    <span
                      className={`
              text-[10px] font-bold px-2.5 py-1 rounded-lg 
              ${urgency.bg} ${urgency.text} border ${urgency.border}
              whitespace-nowrap shrink-0
              group-hover:scale-105 transition-transform
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

      {/* ===== Modern Footer ===== */}
      <div
        className="
        mt-5 pt-4
        border-t border-[#0B5134]/60 dark:border-gray-800 
        flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3
      "
      >
        <div className="flex items-center gap-2 text-xs text-white/70 dark:text-gray-400">
          <span className="text-base">⏳</span>
          <span className="font-medium">
            {plan.length > 0
              ? `Buffer remaining: ${remaining} mins`
              : "Ready to plan your study session"}
          </span>
        </div>

        {plan.length > 0 && (
          <button
            className="
          px-4 py-2 rounded-xl
          bg-gradient-to-r from-emerald-600 to-emerald-500
          text-white font-bold text-xs
          shadow-lg
          transition-all duration-200
          hover:scale-105 hover:shadow-emerald-500/30
          active:scale-95
          flex items-center gap-2
          whitespace-nowrap
        "
          >
            <span>Start Focus Mode</span>
            <span>🚀</span>
          </button>
        )}
      </div>
    </div>
  );
}
