import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({newFilter, setNewFilter}) =>
  <div>
    filter shown with <input value={newFilter} onChange={(e) =>setNewFilter(e.target.value)}/>
  </div>

const PersonForm = ({addPerson, newName, setNewName, newNumber, setNewNumber}) =>
  <form onSubmit={addPerson}>
    <div>name: <input value={newName} onChange={(e) => setNewName(e.target.value)}/></div>
    <div>number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)}/></div>
    <div><button type="submit">add</button></div>
  </form>

const Persons = ({ persons }) => 
  <div>
    {persons.map((person) => 
      <p key={person.name}>{person.name} {person.number}</p>
    )}
  </div>


const App = () => {

  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  
  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then(response =>{
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some((person) => person.name === newName))
      alert(`${newName} is already added to phonebook`)
    else
      setPersons(persons.concat([{name: newName, number: newNumber}]))
    // setNewName("")
    // setNewNumber("")
  }

  const filtered = persons.filter((person) => person.name.toLocaleLowerCase().includes(newFilter.toLocaleLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} setNewFilter={setNewFilter}/>
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber}/>
      <h2>Numbers</h2>
      <Persons persons={filtered}/>
    </div>
  )
}

export default App