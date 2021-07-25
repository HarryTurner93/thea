# Software Design Document
<i>This design document adheres to [IEEE 1016-2009](https://standards.ieee.org/standard/1016-2009.html)</i></br>
<i>All UML diagrams are created with [Plant UML](https://plantuml.com/)</i><br>
<b>Issued:</b> <i>2nd July 2021</i></br>
<b>Author:</b> <i>Harry Turner</i></br>

## Context
This document communicates a design for the Nature View application which is an image processing and management application for camera trap data. It is a web accessible service that allows users involved in camera trap data analysis to upload their images, have them organised by the camera location they came from, have the images automatically analysed by an ML algorithm to detect species present in the image, and then browse the results of that analysis and change classifications where necessary. The added value from this application is to save users time by automating the manual step of detecting animal species in camera trap images.

![Camera Trap](http://www.naturespy.org/wp-content/uploads/2014/05/cameratrap.jpg)
<i>Camera Trap - [Nature Spy](https://www.naturespy.org/2013/11/joy-camera-trapping/)</i>

## Stakeholders & Concerns

#### Thea Business
The Thea business is concerned with low development cost and maximal user satisfaction by meeting the user requirements as well as possible. The business is also concerned with evolvability of the product as user research is carried out and the problem understanding develops.

#### User
The user is concerned with ease of use, in both accessing the system and operating it. Users will not tolerate unreasonable delays or faults. 

#### System Administrator
The system administrator is concerned with simple operation of the system to reduce the maintainance load. (Simpler systems usually need fewer people to keep running). They're concerned with low costs of deployment, both in terms of deployment process and deployment infrastructure.

#### Developer
The developer is concerned with ease of system evolvability and ease of making changes. 

## User Stories (Move to REQUIREMENTS.md)

<i>Because I'm not actively engaging with users whilst building this, these will stay fixed, so I'm putting them here. In reality these would live in Zenhub and evolve constantly.</i>

 - As a user I want a secure user account so that other people can't see my data.
 - As a user I want my sensors displayed on a map so they fit my mental model of organisation.
 - As a user I want to upload images directly from my browser because it's easy and I'm familiar with it.
 - As a user I want the system to predict which species are in my images so that I don't have to.
 - As a user I want the system to store my images so that I can access them easily later on.

## Data Model
This viewpoint addresses the data types used within the system. It's modelled with a UML class diagram.

![Data Model](http://www.plantuml.com/plantuml/png/SoWkIImgAStDuKhDAyaigLG8BKujKgZcKb0eBSrCKIW5yk8pKxXgOTBEYRcfHOa81SbWFeeIpzp4z5I4YamG5wA02souhgw2ae6UdfQI0jGqBWY5a80OmUMGcfS2T1a0)

## Use Case
This viewpoint explains the services offered by the system.

![Use Case Model](http://www.plantuml.com/plantuml/png/ROuz3i8m34PtdyBA14ElW0hCJAW7i8W1I_c9OYFKszEc4kgGxVbxR_2eHjK-CO2xpseSyUoZ98Ua6u6Rb6kxLm1eAmx32GyDHQsICTgRaKe9yY2Jd8wmvbitbP39eqHwiUx5fUQlSaTS0wdAS-we6wLb-ekHar_U_m40)

## Logical Architecture
This viewpoint addresses the main components in the system. It's modelled with a UML class diagram.  
![Component Diagram](http://www.plantuml.com/plantuml/png/NP0nJu0m48Nt_ehkXidD2GCnCIaHQ8pp5IuDM5lJ7aR_lQUanJhTu_5TxhssYI3IyUP4C3ik93kteITn3dadPmHsRtYknwV8r0kQXF43eoYAsNu7RqE1UY0ma51amSWO4jc8Ub85U_eTca84YwBwuWLzArLOm4bDiBoMfK7fytuMZ3v0ellnaSDsw31-_QG6OpOQ9f4BDSsVx9Vt_-fxnBHPZwjydbMwIZ9RQjLktQBwLRAsw5T-wcy0)

#### Rationale
 - Django was chosen for the webserver because the data model can be represented simply using Django Rest Framework and PostgreSQL. 
 - Because this design is not intended for deployment into a cloud environment it doesn't include typical web infrastructure such as proxy servers or loadbalancers, however these would be simple to add if needed. 
 - S3 Object Storage was chosen for storing images, however rather than use the real AWS S3, this implementation uses AWS Local Stack to simulate S3 locally. 
 - React and Redux were chosen as industry standard powerful UI frameworks for frontend applications. There is good support for map based views.
 - FastAPI and Celery were chosen for the ML server so that computation heavy tasks can be taken out of the HTTP Request/Response cycle and offloaded onto worker nodes. These workers will carry out image processing tasks and stick the results into the database, they don't need to respond to the client making this is a natural architectural choice.
 - RabbitMQ is a reasonable choice of message queue that is opensource and plays nicely with Celery.

## Image Upload 
This viewpoint explains how the components interact when a user uploads an image. It is modelled with a UML Sequence Diagram.
![Sequence Diagram](http://www.plantuml.com/plantuml/png/VP71JiCm38RlUOeSuR0Nw66Q14SGXnquLbvhZK2MLh4BsjjZrDIP4U6okVRlpx-T0p5aNYxHmS1JzWynO68FL28tIpaCOGR9lkA9C7zYbdhzC9BdfwCgjjYDm702GlzoUiU1Zp88pYWIcwYwnoq0qjWvLypjzdLuvy_8_PoHmZdXs2yvtjsxQdGduhMjyqPrGxCkHBTm7ouI2icK34rWyvG86xOKqaijyDMwskjQdIU1us_jLhPK7MfOUkZEGu9ufK9h7a8fM-EVHuXHCQfh3bDLOpqPkKGckrbbgQLwJ7Nx1O6RJxyELtpZoBfEupqiTdZ3uMD3oZ-CFsg8x5T0A4ddQzUjuTBfC1AMbZJn_prLW6bq1_bPBl4R)

## Design Decisions
 - Map behind everything. Nice effect.
 - List/Retrieve serializers for camera. 

## Front End Mocks
I created these mockups as a guide to building the UI, the details are slightly different as I used the Evergreen UI component library. There are also other screens such as dialogs that aren't included here. I mocked these up as a rough idea of what I wanted to do, then filled in the gaps whilst coding the front end. A small project like this didn't require complete and accurate mockups up front, but just enough so I knew what features I'd need to build.

![Camera Dialog](https://github.com/HarryTurner93/project_thea_revamped/blob/main/artifacts/mock_1.png)
![Browser](https://github.com/HarryTurner93/project_thea_revamped/blob/main/artifacts/mock_2.png)

## Front End Components
#### Map
Map component, when the token changes it fetches a list of cameras and displays them. BEcause these are markers it creates special objects to track them all and doesn't add cameras already in the list. 


## Todo
ML Models, Datasets, Training Experiments and Results.
UI Wireframes.
