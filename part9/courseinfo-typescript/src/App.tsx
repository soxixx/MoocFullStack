import React from 'react';
  const App: React.FC = () => {
    // new types
  interface CoursePartBase {
    name: string;
    exerciseCount: number;
    type: string
  }

  interface CoursePartDescription extends CoursePartBase {
    description: string
  }

  interface CourseNormalPart extends CoursePartDescription {
    type: "normal";
  }

  interface CourseProjectPart extends CoursePartBase {
    type: "groupProject";
    groupProjectCount: number;
  }

  interface CourseSubmissionPart extends CoursePartDescription {
    type: "submission";
    exerciseSubmissionLink: string;
  }

  interface CourseSpecialPart extends CoursePartDescription {
    type: "special";
    requirements: Array<string>;
  }

  type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart | CourseSpecialPart;


  // this is the new coursePart variable
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is the leisured course part",
      type: "normal"
    },
    {
      name: "Advanced",
      exerciseCount: 7,
      description: "This is the harded course part",
      type: "normal"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      type: "groupProject"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev",
      type: "submission"
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      type: "special"
    }
  ]

  interface PartProps {
    part: CoursePart
  }

  interface ContentProps {
    courseParts: CoursePart[]
  }

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const courseName = "Half Stack application development";

  interface HeaderProps {
    name: string
  }

  const Header = ({name} : HeaderProps) => {
    return <h1>{name}</h1>;
  }

  const Total = ({courseParts}: ContentProps) => {
    return (
      <p>
        Number of exercises{" "}
        {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
      </p>
    )
  }

  const Part = ({part}:PartProps) => {
    switch(part.type){
      case "normal":
        return (
          <div> 
            <p><b>{part.name} {part.exerciseCount}</b></p>
            <i>{part.description}</i>
          </div>
        )
      case "groupProject":
        return (
          <div> 
            <p><b>{part.name} {part.exerciseCount} </b></p>
            <p>project exercises {part.groupProjectCount}</p>
          </div>
        )
      case "submission":
        return (
          <div> 
            <p><b>{part.name} {part.exerciseCount} </b></p>
            <i>{part.description}</i>
            <p>submit to {part.exerciseSubmissionLink}</p>
          </div>
        )
      case "special":
        return (
          <div> 
            <p><b>{part.name} {part.exerciseCount} </b></p>
            <i>{part.description}</i>
            <p>required skills {(part.requirements).join(', ')}</p>
          </div>
        )
      default:
        return assertNever(part);
    }
  }

  const Content = ({courseParts}:ContentProps) => {
    return (
      <div>
        {courseParts.map(course => <Part key={course.name} part={course} />)}
      </div>
    )
  }

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;

// ---------------Below 9.14
// import React from 'react';

// const App: React.FC = () => {
//   const courseName = "Half Stack application development";
//   const courseParts = [
//     {
//       name: "Fundamentals",
//       exerciseCount: 10
//     },
//     {
//       name: "Using props to pass data",
//       exerciseCount: 7
//     },
//     {
//       name: "Deeper type usage",
//       exerciseCount: 14
//     }
//   ];

//   interface HeaderProps {
//     name: string
//   }

//   interface Course {
//     name: string,
//     exerciseCount: number
//   }

//   interface ContentProps {
//     courseParts: Array<Course>
//   }

//   const Header = ({name} : HeaderProps) => {
//     return <h1>{name}</h1>;
//   }

//   const Content = ({courseParts}: ContentProps) => {
//     return (
//       <div>
//         {courseParts.map(course => <p key = {course.name}> {course.name} {course.exerciseCount} </p>)}
//       </div>
//     )
//   }

//   const Total = ({courseParts}: ContentProps) => {
//     return (
//       <p>
//         Number of exercises{" "}
//         {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
//       </p>
//     )
//   }

//   return (
//     <div>
//       <Header name={courseName} />
//       <Content courseParts={courseParts} />
//       <Total courseParts={courseParts} />
//     </div>
//   );
// };

// export default App;