/**
 * This file contains some function stubs(ie incomplete functions) that
 * you MUST use to begin the work for calculating the grades.
 *
 * You may need more functions than are currently here...we highly encourage you to define more.
 *
 * Anything that has a type of "undefined" you will need to replace with something.
 */
import { IUniversityClass, IAssignment, IGrades, IStudent } from "../types/api_types";

const headers = {
  'Accept': 'application/json',
  'x-functions-key': '6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ=='
}
// Fetching Functions that will be exported to other files that require these functions
async function fetchStudents(classID: string): Promise<string[]> {
  const studentURL = `https://spark-se-assessment-api.azurewebsites.net/api/class/listStudents/${classID}?buid=U22651662`;
  
  const studentResponse = await fetch(studentURL,
    {
      method: 'GET',
      headers: headers
    });

  return await studentResponse.json();
}

async function fetchClassById(classID: string): Promise<IUniversityClass> {
  const classURL = `https://spark-se-assessment-api.azurewebsites.net/api/class/GetById/${classID}?buid=U22651662`;
  const classResponse = await fetch(classURL,
    {
      method: 'GET',
      headers: headers
    });
  const klass: IUniversityClass = await classResponse.json(); 
  return klass;
}

async function fetchAssignments(classID: string): Promise<IAssignment[]> {
  const assignmentURL = `https://spark-se-assessment-api.azurewebsites.net/api/class/listAssignments/${classID}?buid=U22651662`
  const assignmentResponse = await fetch(assignmentURL,
    {
      method: 'GET',
      headers: headers
    });

  const assignments: IAssignment[] = await assignmentResponse.json();
  return assignments;
}

async function fetchStudentGrades(studentID: string, classID: string): Promise<IGrades> {
  const gradeURL = `https://spark-se-assessment-api.azurewebsites.net/api/student/listGrades/${studentID}/${classID}/?buid=U22651662`;
    const gradeResponse = await fetch(gradeURL,
      {
        method: 'GET',
        headers: headers
      });

    const grades: IGrades = await gradeResponse.json();
    return grades;
}


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
  let finalGrade = 0;
  for (const assignment of classAssignments) { // Loop through the assignments in classAssignments
    const gradeObject = grades.grades[0]; // To access the key-value pair of grades

    const grade_i = (gradeObject as any)[assignment.assignmentId]; // Raw grade that is matched up with a given assignment
  
    const weight_i = assignment.weight / 100; // Divide by 100 for weighted average -- converts weight to a fraction
 
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


  // const studentURL = `https://spark-se-assessment-api.azurewebsites.net/api/class/listStudents/${classID}?buid=U22651662`;
  // const studentHeaders = {
  //   'Accept': 'application/json',
  //   'x-functions-key': '6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ=='
  // }
  // const studentResponse = await fetch(studentURL,
  //   {
  //     method: 'GET',
  //     headers: studentHeaders
  //   });

  const students: string[] = await fetchStudents(classID);
  // console.log(students);
  

  // const classURL = `https://spark-se-assessment-api.azurewebsites.net/api/class/GetById/${classID}?buid=U22651662`;
  // const classResponse = await fetch(classURL,
  //   {
  //     method: 'GET',
  //     headers: studentHeaders
  //   });
  const klass: IUniversityClass = await fetchClassById(classID);

  const studentGrades: { id: string, studentName: string, finalGrade: number }[] = [];

  // const assignmentURL = `https://spark-se-assessment-api.azurewebsites.net/api/class/listAssignments/${classID}?buid=U22651662`
  // const assignmentResponse = await fetch(assignmentURL,
  //   {
  //     method: 'GET',
  //     headers: studentHeaders
  //   });

  const assignments: IAssignment[] = await fetchAssignments(classID);

  const assignmentWeights: { [key: string]: number } = {};

  for (const assignment of assignments) {
    assignmentWeights[assignment.assignmentId] = assignment.weight;
  }

  for (const student of students) {
    // console.log(student); // Check the structure of the student object
    const studentID = student;
    // console.log('studentID:', studentID); // Check if studentID is undefined
    // const studentId = student.universityId;
    // const gradeURL = `https://spark-se-assessment-api.azurewebsites.net/api/student/listGrades/${studentID}/${classID}/?buid=U22651662`;
    // const gradeResponse = await fetch(gradeURL,
    //   {
    //     method: 'GET',
    //     headers: studentHeaders
    //   });

    const grades: IGrades = await fetchStudentGrades(studentID, classID);
    // console.log(grades);
    const finalGrade = await calculateStudentFinalGrade(studentID, assignments, klass, grades);
    // console.log(finalGrade);

    const stdURL = `https://spark-se-assessment-api.azurewebsites.net/api/student/GetById/${student}?buid=U22651662`
    const stdResponse = await fetch(stdURL,
      {
        method: 'GET',
        headers: headers
      });

    const std: IStudent = await stdResponse.json();
    // console.log(std);

    studentGrades.push({
      id: studentID,
      studentName: std.name,
      finalGrade: finalGrade
    });

  }
  return studentGrades;
}
