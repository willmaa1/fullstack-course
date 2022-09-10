const Header = ({ text }) => <h2>{text}</h2>

const Total = ({ sum }) => <p><strong>total of {sum} exercises</strong></p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <div>
      {parts.map((part) =>
      <Part key={part.id} part={part}/>
      )}
  </div>


const Course = ({ course }) => 
  <div>
    <Header text={course.name}/>
    <Content parts={course.parts} />
    <Total sum={course.parts.reduce((prev, cur) => prev + cur.exercises, 0)} />
  </div>


export default Course