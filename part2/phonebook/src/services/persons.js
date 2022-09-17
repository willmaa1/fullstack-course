import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => axios.get(baseUrl);

const addPerson = (person) => axios.post(baseUrl, person)

const deletePerson = (id) => axios.delete(`${baseUrl}/${id}`)

const updateNumber = (person) => axios.put(`${baseUrl}/${person.id}`, person)

export default { getAll, addPerson, deletePerson, updateNumber }