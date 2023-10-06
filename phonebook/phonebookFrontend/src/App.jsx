import { useState, useEffect } from "react";
import "./App.css";
import People from "./Components/People";
import Search from "./Components/Search";
import AddNumber from "./Components/AddNumber";
import axios from 'axios'
import personService from './services/persons'
import Notification from "./Components/Notification";


const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationCode, setNotificationCode] = useState(0)

  useEffect(() => {
    personService.getAll().then(initialPerson => setPersons(initialPerson))
  }, [] )

  const addPerson = (event) => {
    event.preventDefault();
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} has already been added to the phonebook, would you like to update the number?`)) {
        const updatedPerson = persons.find(p => p.name === newName)
        const changedNumber = {...updatedPerson, number: newNumber}

        personService
          .update(updatedPerson.id, changedNumber)
          .then((returnPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== updatedPerson.id ? person : returnPerson
              )
            );
            setNewName("");
            setNewNumber("");
            setNotificationCode(1);
            setNotification(`Updated ${updatedPerson.name}'s number`);
            setTimeout(() => {
              setNotification(null);
              setNotificationCode(0);
            }, 5000);
          })
          .catch((error) => {
            console.log(error)
            setNotificationCode(2);
            setNotification(`${updatedPerson.name} has already been deleted`);
            setTimeout(() => {
              setNotification(null);
              setNotificationCode(0);
            }, 5000);  
            setPersons(persons.filter(person => person.id !== updatedPerson.id))
          });
      }
    }
    else 
    {const personObject = {
      name: newName,
      number: newNumber,
    };
    personService
    .create(personObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName("");
    setNewNumber("");
    setNotificationCode(1);
    setNotification(`Added ${personObject.name} to your phonebook`);
    setTimeout(() => {
      setNotification(null);
      setNotificationCode(0);
    }, 5000);
    })}
  };

  const handleNewPerson = (event) => {
    setNewName(event.target.value);
  };
  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  }
  const handleSearch = (event) => {
    event.preventDefault()
    setSearch(event.target.value.toLowerCase())
  }

  const handleDelete = (id) => {
    const currentPerson = persons.find(p => p.id === id)
    
    if (confirm(`Are you sure you want to delete ${currentPerson.name}?`))
      {personService
        .deletedPerson(id)
        .then((response) => {
          setPersons(persons.filter((p) => p.id !== id));
          setNotificationCode(2);
          setNotification(` ${currentPerson.name} has been deleted`);
          setTimeout(() => {
            setNotification(null);
            setNotificationCode(0);
          }, 5000);
        })
        .catch((error) => {
          setNotificationCode(2);
          setNotification(`${currentPerson.name} has already been deleted`);
          setTimeout(() => {
            setNotification(null);
            setNotificationCode(0);
          }, 5000);
          setPersons(
            persons.filter((person) => person.id !== currentPerson.id)
          );
        });
      ;}
  }

  return (
    <div>
      <h2>Phonebook</h2>
      {notificationCode === 1 && (
        <Notification message={notification} styling="style1" />
      )}
      {notificationCode === 2 && (
        <Notification message={notification} styling="style2" />
      )}

      <Search search={search} onChange={handleSearch} />
      <AddNumber
        addPerson={addPerson}
        newName={newName}
        handleNewPerson={handleNewPerson}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
      />
      <h2>Numbers</h2>
      <People persons={persons} search={search} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
