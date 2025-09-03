import React, { useState, useRef } from "react";
import Person from "./Person";

export default function PersonList(props) {
  const [list, setList] = useState(props.people);
  const nameRef = useRef();
  const surnameRef = useRef();

  const onSubmit = (evt) => {
    evt.preventDefault();
    addPerson(nameRef.current.value, surnameRef.current.value);
    nameRef.current.value = "";
    surnameRef.current.value = "";
  };

  const addPerson = (name, surname) => {
    setList([...list, { name, surname }]);
  };

  return (
    <div>
      <h1>{list.length} people in this list</h1>

      <form onSubmit={onSubmit}>
        <input type="text" ref={nameRef} placeholder="First name" required />
        <input type="text" ref={surnameRef} placeholder="Surname" required />
        <button type="submit">Add Person</button>
      </form>

      <ul>
        {list.map((person, index) => (
          <Person key={index} name={person.name} surname={person.surname} />
        ))}
      </ul>
    </div>
  );
}
