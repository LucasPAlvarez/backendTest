//const http = require('http')

const express = require('express')
const app = express()
app.use(express.json())

//middleware
const requestReporter = (request, response, next) => {
    console.log(`Method: ${request.method}\nPath: ${request.path}\nBody: ${request.body}\n---`)
    next()
}

app.use(requestReporter)


let notes = [
    {id: "1",content: "HTML is easy",important: true},
    {id: "2",content: "Browser can execute only JavaScript",important: false},
    {id: "3",content: "GET and POST are the most important methods of HTTP protocol",important: true}
]
/*
const app = http.createServer((request, response) => {
    response.writeHead(200, {'content-type':'application/json'})
    response.end(JSON.stringify(notes))
})
*/

app.get('/', (request, response) => {
    response.send('<h1>Hello world<h1>')
})

app.get('/api/notes', (request, response) =>{
    response.json(notes)
})

app.get('/api/notes/:id', (request,response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)

    if(note){
        response.json(note)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

const generateId = () =>{
    const maxId = notes.length> 0
    ? Math.max(notes.map(n => n.id))
    : 0
    return (maxId + 1)
}

app.post('/api/notes', (request, response) => {
    const note = request.body
    note.id = generateId()

    notes = notes.concat(note)

    response.json(note)
})

const unkonwEndpoint = (request, response) =>{
    response.status(404).send({error:'Unknown Endpoint'})
}

app.use(unkonwEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT,() =>{
    console.log(`Server runs on port ${PORT}`)
})
/*
app.listen(PORT)
console.log(`Server runs on port ${PORT}`)*/
