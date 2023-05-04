const express = require('express');
const app = express();
const port = 3000;

// Підключення до БД
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'users',
  password: '0808',
  port: 5432
})

// Отримання всіх даних з таблиці | Завдання 0
const getUsers = (request, response) => {
  pool.query('SELECT * FROM "students_Roketskyi" ORDER BY id ASC', (error, results) => {
    if (error) throw error

    response.status(200).json(results.rows)
  })
}

app.get('/', (req, res) => {
  getUsers(req, res);
});

// Створення таблиці | Завдання 1
const createTable = (request, response) => {
  pool.query(
    `CREATE TABLE IF NOT EXISTS "students_Roketskyi" (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      age INTEGER
    );`,

    (error, results) => {
      if (error) throw error;

      response.status(200).json(results.rows)
      console.log('Таблиця успішно створена');
    }
  );
}

app.get('/createTable', (req, res) => {
  createTable(req, res);
});

// Додавання нового студента в таблицю | Завдання 1
const addStudent = (request, response) => {
  const { first_name, last_name, age } = { first_name: 'Vitya', last_name: 'Ivanov', age: 13}

  pool.query(`INSERT INTO "students_Roketskyi" (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *`, 
  [first_name, last_name, age], (error, results) => {
    if (error) throw error;

    response.status(201).send(`User added with ID: ${results.rows[0].id}`)
  })
}

app.get('/addStudent', (req, res) => {
  addStudent(req, res);
});

// Отримання всіх студентів з таблиці "students_Roketskyi" | Завдання 1
const getAllStudents = (request, response) => {
  pool.query('SELECT * FROM "students_Roketskyi"', (error, results) => {
    if (error) throw error;

    response.status(200).json(results.rows)
  })
}

app.get('/getAllStudents', (req, res) => {
  getAllStudents(req, res);
});


// Вибірка студентів, відсортованих за віком | Завдання 2
// http://localhost:3000/getStudentsByAge?sort=DESC - Сортування від старшого до молодшого
// http://localhost:3000/getStudentsByAge?sort=ASC - Сортування від молодшого до старшого 

const getStudentsByAge = (request, response) => {
  const sort = request.query.sort;

  pool.query(`SELECT * FROM "students_Roketskyi" ORDER BY age ${sort}`, (error, results) => {
    if (error) throw error;

    response.status(200).json(results.rows)
  })
}

app.get('/getStudentsByAge', (req, res) => {
  getStudentsByAge(req, res);
});

app.listen(port, () => {
    console.log(`Веб-сервер був запущений за наступним посиланням: http://localhost:${port}/`);
});
