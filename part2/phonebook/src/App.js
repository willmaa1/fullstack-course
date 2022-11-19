import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({newFilter, setNewFilter}) =>
  <div>
    filter shown with <input value={newFilter} onChange={(e) =>setNewFilter(e.target.value)}/>
  </div>

const Notification = ({notification}) => {
  if (notification === null) {
    return null
  }
  const styling = {
    color: notification.color,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 5,
    background: "lightgrey"
  }

  return (
    <div style={styling}>
      {notification.message}
    </div>
  )
}

const PersonForm = ({addPerson, newName, setNewName, newNumber, setNewNumber}) =>
  <form onSubmit={addPerson}>
    <div>name: <input value={newName} onChange={(e) => setNewName(e.target.value)}/></div>
    <div>number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)}/></div>
    <div><button type="submit">add</button></div>
  </form>

const Persons = ({ filtered, persons, setPersons, notificationTimeout }) => {
  const confirmDelete = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .deletePerson(person.id)
        .then(() => {
          setPersons(persons.filter((per)=>per.id !== person.id));
          notificationTimeout(`Deleted ${person.name}`, "green");
        })
        .catch(error => notificationTimeout(`Information of ${person.name} has already been deleted from the server`, "red"))
    }
  }
  return (
    <div>
    {filtered.map((person) => 
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
  const [notification, setNotification] = useState(null)

  // Utility function for creating a notification with timeout of 5s
  const notificationTimeout = (message, color) => {
    setNotification({message, color})
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }
  
  useEffect(() => {
    personService
      .getAll()
      .then(allPersons => setPersons(allPersons))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const existing = persons.find((person) => person.name === newName)

    if (existing !== undefined) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const newPerson = { ...existing, number: newNumber }
        personService
          .updateNumber(newPerson)
          .then((updatedPerson) => {
            setPersons(persons.map(per => per.id !== updatedPerson.id ? per : updatedPerson))
            notificationTimeout(`Number of ${updatedPerson.name} changed`, "green")
          })
          // Not the most elegant catch but it works
          .catch(error => notificationTimeout(error.response ? error.response.data.error : `Information of ${newPerson.name} has already been deleted from the server`, "red"))
      }
    } else {
      const person = {name: newName, number: newNumber}
      personService
        .addPerson(person)
        .then((addedPerson) => {
          console.log(addedPerson)
          setPersons(persons.concat([addedPerson]))
          notificationTimeout(`Added ${addedPerson.name}`, "green")
        })
        .catch(error => notificationTimeout(`${error.response.data.error}`, "red"))
    }
  }

  const filtered = persons.filter((person) => person.name.toLocaleLowerCase().includes(newFilter.toLocaleLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter newFilter={newFilter} setNewFilter={setNewFilter}/>
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber}/>
      <h2>Numbers</h2>
      <Persons filtered={filtered} persons={persons} setPersons={setPersons} notificationTimeout={notificationTimeout}/>
    </div>
  )
}

export default App