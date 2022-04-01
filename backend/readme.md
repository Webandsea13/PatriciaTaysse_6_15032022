# backend

Pour lancer le serveur :  
'npm run start'

# Routes

## La route POST pour créer un compte

http://localhost:3000/api/auth/signup

Body_raw :
{"email" : "xxx",
"password" : "xxx"}

## La route POST pour se logger

http://localhost:3000/api/auth/login

Body_raw :
{"email" : "xxx",
"password" : "xxx"}

## La route POST pour créer une sauce

http://localhost:3000/api/sauces

Authorization : bearer token token : xxx
Body_form-data
Key : sauce
Value : {
"\_id":"xxx",
"userId":"xxx",
"name":"xxx",
"manufacturer":"xxx",
"description":"xxx",
"mainPepper":"xxx",
"imageUrl":"",
"heat":X,
"likes" :X,
"dislikes":X,
"usersLiked" :[],
"usersDisliked":[],
}

    Key : image
    file et sélectionner l'image

## La route GET pour lire toutes les sauces

http://localhost:3000/api/sauces

Authorization : bearer token token : XXXX

## La route GET pour lire une sauce

http://localhost:3000/api/sauces/:id

Authorization : bearer token token : XXXX
Params : key : id (id sauce : \_id=req.params.id)

## La route PUT pour modifier une sauce

http://localhost:3000/api/sauces/:id

Authorization : bearer token token : XXXX
Params : key : id (id sauce : \_id=req.params.id)
Body_form-data
Key : sauce
Value : {
"\_id":"xxx",
"userId":"xxx",
"name":"xxx",
"manufacturer":"xxx",
"description":"xxx",
"mainPepper":"xxx",
"imageUrl":"",
"heat":X,
"likes" :X,
"dislikes":X,
"usersLiked" :[],
"usersDisliked":[],
}

    Key : image
    file et sélectionner l'image

## La route DELETE pour supprimer une sauce

http://localhost:3000/api/sauces/:id

Authorization : bearer token token : XXXX
Params : key : id (id sauce : \_id=req.params.id)

## La route POST pour liker ou disliker une sauce

http://localhost:3000/api/sauces/:id/like

Authorization : bearer token token : XXXX
Params : key : id (id sauce : \_id=req.params.id)
Body_raw :
{"userId" : "xxx",
"like" : X}
