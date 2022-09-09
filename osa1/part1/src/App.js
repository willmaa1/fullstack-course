const Hello = (props) => {
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  )
}

const App = () => {
  const nimi = "tst"
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Pekka" age={40+2}/>
      <Hello name={nimi} age="32" />
      <Hello />
    </div>
  )
}

export default App