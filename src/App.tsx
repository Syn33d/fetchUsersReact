import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import { User } from './userInterface'

function App() {
  const [users, setUser] = useState<User[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('')
  const [selectedAgeSort, setSelectedAgeSort] = useState<string>('')
  const [selectedName, setSelectedName] = useState<string>('')

  const filterByGender = (userList: User[]) => {
    if (selectedGender === '') {
      return userList
    }
    return userList.filter(user => user.gender === selectedGender)
  }

  const sortByAge = (userList: User[]) => {
    if (selectedAgeSort === '') {
      return userList
    }
    return userList.sort((user1, user2) => selectedAgeSort === 'desc' ? user2.dob.age - user1.dob.age : user1.dob.age - user2.dob.age)
  }

  const filterByName = (userList: User[]) => {
    if (selectedName === '') {
      return userList
    }
    return userList.filter(user => user.name.first.toLowerCase().includes(selectedName) || user.name.last.toLowerCase().includes(selectedName))
  }


  const usersToDisplay = filterByName(sortByAge(filterByGender(users)));

  const fetchUsers = () => {
    axios('https://randomuser.me/api/?results=20').then(({ data: { results } }) => {
      setUser(results);
    });
  };

  const clearUsers = () => {
    setUser([]);
  };

  const youngestUsers = () => {
    const youngestUsers = [...users].sort((a, b) => (a.dob.age - b.dob.age));
    setUser(youngestUsers);
  }

  const oldestUsers = () => {
    const oldestUser = [...users].sort((a, b) => (b.dob.age > a.dob.age ? 1 : -1));
    setUser(oldestUser);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container-fluid">
      <div id="app">
        <div>
          <h1>Hello !</h1>
          <hr />
          <button className="btn btn-primary" onClick={fetchUsers} disabled={usersToDisplay.length > 0}>Fetch users</button>
          <button className="btn btn-danger" onClick={clearUsers} disabled={usersToDisplay.length === 0}>Cancel users</button>
          <p>Nombre d'utilisateurs : <span>{usersToDisplay.length}</span></p>

          <div className="form-group">
            <label>
              filtres: {selectedGender}
              <select className="form-control" value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
                <option value="">Tous</option>
                <option value="male">Hommes</option>
                <option value="female">Femmes</option>
              </select>
            </label>
          </div>

          <div className="form-group">
            <label>
              age: {selectedAgeSort}
              <select className="form-control" value={selectedAgeSort} onChange={(e) => setSelectedAgeSort(e.target.value)}>
                <option value="">Rien</option>
                <option value="asc">Ascendant</option>
                <option value="desc">Descendant</option>
              </select>
            </label>
          </div>

          <div className="form-group">
            <label>
              Name: {selectedName}
              <input className="form-control" value={selectedName} onChange={(e) => setSelectedName(e.target.value)} />
            </label>
          </div>

          <button className="btn btn-primary sort-btn youngest" onClick={youngestUsers}> Sort By Youngest Users </button>
          <button className="btn btn-primary sort-btn oldest" onClick={oldestUsers}> Sort By Oldest Users </button>

          <div>
            <h2><center>Aucun utilisateurs</center></h2>
          </div>

          <table id="tbl-users" className="table table-hover">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Âge</th>
                <th>Tel</th>
                <th>Civilité</th>
              </tr>
            </thead>

            <tbody>
              {usersToDisplay.map((user, index) => (
                <tr key={index}>
                  <td>{`${user.name.first} ${user.name.last}`}</td>
                  <td>{user.email}</td>
                  <td>{user.dob.age}</td>
                  <td>{user.phone}</td>
                  <td>{user.gender === 'male' ? '🤷‍♂️' : '🤷‍♀️'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default App