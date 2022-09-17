import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  const result = axios.get(baseUrl);
  return result.then((response) => response.data)
}

const addPerson = (person) => {
  const result = axios.post(baseUrl, person);
  return result.then((response) => response.data)
}

const deletePerson = (id) => axios.delete(`${baseUrl}/${id}`)

const updateNumber = (person) => {
  const result = axios.put(`${baseUrl}/${person.id}`, person)
  return result.then((response) => response.data)
}

export default { getAll, addPerson, deletePerson, updateNumber }