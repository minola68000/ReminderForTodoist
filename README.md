# Reminder for Tdoist

Todoist does not provide a function to send reminder for free plan user.
This project enables you to send reminder according to Todoist's todo.

# DEMO

Todoist 👉 IFTTT 👉 GAS 👉 Google Spread Sheet

GAS Trigger 👉 GAS 👉 Google Spread Sheet 👉 LINE or AppNotification

# Features

If you are IFTTT pro user and need just simple and free reminder function, it might be fit for your demands.

# Requirement

* Todoist account
* IFTTT Pro account (It uses filter code. View point of technicall, you can use free plan to move code into GAS)
* Google account (It uses GAS and Spread Sheet)

# Installation

* Set up Applet of the IFTTT(registerTodo)

  <img width="554" alt="registerTodo" src="https://user-images.githubusercontent.com/67622338/94555097-06f4f980-0296-11eb-97f8-4b3a2cb6066c.png">  
* Set up Applet of the IFTTT(completeTodo)

  <img width="566" alt="completeTodo" src="https://user-images.githubusercontent.com/67622338/94555122-0e1c0780-0296-11eb-99f8-439e3c05867a.png">
* Set up code of the GAS.
* Set up trriger of the GAS.

# Usage

Create a new todo from Todoist(both of Web and App are OK).

# Note

* You can not change due date after creating the todo. You can re-create using duplicate function instead.
* Completion of a todo make reminder disabled but deletion of a todo will not.
* If you deleted a todo, coresponding data in the spread sheet will be remained and reminder will not deleted. To avoide this behavior, you should to mark it as completed instead of deletion.

# Author

minola68000

# License

free
