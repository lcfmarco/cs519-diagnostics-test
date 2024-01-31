/**
 * This file contains some function stubs(ie incomplete functions) that
 * you MUST use to begin the work for calculating the grades.
 *
 * You may need more functions than are currently here...we highly encourage you to define more.
 *
 * Anything that has a type of "undefined" you will need to replace with something.
 */
import { IUniversityClass, IAssignment, IGrades, IStudent } from "../types/api_types";

// Headers used for every API call
const headers = {
  'Accept': 'application/json',
  'x-functions-key': '6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ=='
}

/* Fetching Functions that will be exported to other files that require these functions */

// SOURCE: https://www.sohamkamani.com/typescript/rest-http-api-call/
// This was a good guide on the general idea of how I should make API calls on Typescript (learned about end-points, etc)

// Function that fetches all students in a class
export async function fetchStudents(classID: string): Promise<string[]> {
  const studentURL = `https://spark-se-assessment-api.azurewebsites.net/api/class/listStudents/${classID}?buid=U22651662`;
  
  const studentResponse = await fetch(studentURL,
    {
      method: 'GET',
      headers: headers
    });

  return await studentResponse.json();
}

// Function to fetch the class detail by using the classID
export async function fetchClassById(classID: string): Promise<IUniversityClass> {
  const classURL = `https://spark-se-assessment-api.azurewebsites.net/api/class/GetById/${classID}?buid=U22651662`;
  const classResponse = await fetch(classURL,
    {
      method: 'GET',
      headers: headers
    });
  const klass: IUniversityClass = await classResponse.json(); 
  return klass;
}

// Fetches all assignments of a class (this includes weight, and others) -- refer to api_types.ts for what these types entail
export async function fetchAssignments(classID: string): Promise<IAssignment[]> {
  const assignmentURL = `https://spark-se-assessment-api.azurewebsites.net/api/class/listAssignments/${classID}?buid=U22651662`
  const assignmentResponse = await fetch(assignmentURL,
    {
      method: 'GET',
      headers: headers
    });

  const assignments: IAssignment[] = await assignmentResponse.json();
  return assignments;
}

// This returns the grades of a student in a class
export async function fetchStudentGrades(studentID: string, classID: string): Promise<IGrades> {
  const gradeURL = `https://spark-se-assessment-api.azurewebsites.net/api/student/listGrades/${studentID}/${classID}/?buid=U22651662`;
    const gradeResponse = await fetch(gradeURL,
      {
        method: 'GET',
        headers: headers
      });

    const grades: IGrades = await gradeResponse.json();
    return grades;
}

// Provides the detail of Students when searching by Student ID -- had to change the return type to an array because I couldn't access its attributes
// No idea why (realized via console.log testing)
// This was a debugging solution discovered by ChatGPT -- simply asked it why the error was happening and showing the results from unit testing with console.log
export async function fetchStudentDetails(studentID: string): Promise<IStudent[]> {
  const stdURL = `https://spark-se-assessment-api.azurewebsites.net/api/student/GetById/${studentID}?buid=U22651662`
    const stdResponse = await fetch(stdURL,
      {
        method: 'GET',
        headers: headers
      });

    const std: IStudent[] = await stdResponse.json();

    return std;
}

/* END OF EXTERNAL FUNCTIONS */

/**
 * This function might help you write the function below.
 * It retrieves the final grade for a single student based on the passed params.
 * 
 * If you are reading here and you haven't read the top of the file...go back.
 */
export async function calculateStudentFinalGrade(
  studentID: string,
  classAssignments: IAssignment[], // Store assignments as a list (list of IAssignment) as a student can have multiple assignments
  klass: IUniversityClass,
  grades: IGrades
): Promise<number> {
  let finalGrade = 0; // accumulator for a students grade
  for (const assignment of classAssignments) { // Loop through the assignments in classAssignments
    const gradeObject = grades.grades[0]; // To access the key-value pairs of grades

    // CITE: debugged with ChatGPT. Could not directly access grades.grades[assignment.assignmentId] and could not figure it out
    const grade_i: number = (gradeObject as any)[assignment.assignmentId]; // Raw grade that is matched up with a given assignment. Couldn't directly access by indexing assignmentId, otherwise it returns undefined
  
    const weight_i: number = assignment.weight / 100; // Divide by 100 for weighted average -- converts weight to a fraction
 
    finalGrade += grade_i * weight_i; // Update the finalGrade as the weighted grade for that assignment

  }
  return finalGrade;
}

/**
 * You need to write this function! You might want to write more functions to make the code easier to read as well.
 * 
 *  If you are reading here and you haven't read the top of the file...go back.
 * 
 * @param classID The ID of the class for which we want to calculate the final grades
 * @returns Some data structure that has a list of each student and their final grade.
 */
export async function calcAllFinalGrade(classID: string): Promise<{ id: string, studentName: string, finalGrade: number }[]> { // Returning an array of student ID, name and grade

  // Using our fetch functions to fetch the necessary students, class, assignments, etc
  const students: string[] = await fetchStudents(classID);
  
  const klass: IUniversityClass = await fetchClassById(classID);

  // Initializing an empty array that will store the id, studentname, and final grade
  const studentGrades: { id: string, studentName: string, finalGrade: number }[] = [];

  const assignments: IAssignment[] = await fetchAssignments(classID);

  // Initializing an empty dictionary/hash table as a way to store an assignments weights so we have a way to associate a weight to an assignment of a class
  const assignmentWeights: { [key: string]: number } = {};

  for (const assignment of assignments) { // Loop through the assignments of the class
    assignmentWeights[assignment.assignmentId] = assignment.weight; // Store in the weight of that assignment to our dictionary
  }

  for (const student of students) { // Loop through the students taking the class
    const studentID = student;
    
    const grades: IGrades = await fetchStudentGrades(studentID, classID); // Fetch the grades of the student

    const finalGrade = await calculateStudentFinalGrade(studentID, assignments, klass, grades); // Calculate their final grade with our external function

    // Turning this into an array of IStudent was also debugged by ChatGPT. Similar issue I had with fetching student details as well above
    const std: IStudent[] = await fetchStudentDetails(studentID); // Store student details so we know the name of the student

    studentGrades.push({ // Return as an array of id, student name and final grade 
      id: studentID,
      studentName: std[0].name,
      finalGrade: finalGrade
    });

  }
  return studentGrades;
}
