import { useState, useEffect } from 'react'
import personService from './services/persons'

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

const Persons = ({ persons, setPersons }) => {
  const confirmDelete = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .deletePerson(person.id)
        .then(setPersons(persons.filter((per)=>per.id !== person.id)))
    }
  }
  return (
    <div>
    {persons.map((person) => 
      <p key={person.name}>{person.name} {person.number} <button onClick={() => confirmDelete(person)} >delete</button></p>
    )}
  </div>
  )
} 


const App = () => {

  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  
  useEffect(() => {
    personService
      .getAll()
      .then(response =>{
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const existing = persons.find((person) => person.name === newName)

    if (existing !== undefined) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const newPerson = { ...existing, number: newNumber }
        personService
          .updateNumber(newPerson)
          .then((response) => {
            setPersons(persons.map(per => per.id !== newPerson.id ? per : response.data))
          })
      }
    } else {
      const id = persons.length > 0 ? persons[persons.length-1].id+1 : 1 // id is not added by database
      const person = {name: newName, number: newNumber, id: id}
      personService
        .addPerson(person)
        .then((response) => {
          setPersons(persons.concat([response.data]))
        })
    }
  }

  const filtered = persons.filter((person) => person.name.toLocaleLowerCase().includes(newFilter.toLocaleLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} setNewFilter={setNewFilter}/>
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber}/>
      <h2>Numbers</h2>
      <Persons persons={filtered} setPersons={setPersons}/>
    </div>
  )
}

export default App