/**
 * This file contains some function stubs(ie incomplete functions) that
 * you MUST use to begin the work for calculating the grades.
 *
 * You may need more functions than are currently here...we highly encourage you to define more.
 *
 * Anything that has a type of "undefined" you will need to replace with something.
 */
import { IUniversityClass, IAssignment, IGrades, IStudent} from "../types/api_types";


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
    const grade_i = grades.grades[assignment.assignmentId]; // Store the raw grade of assignment
    const weight_i = assignment.weight; // Store the weight of the assignment
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
export async function calcAllFinalGrade(classID: string): Promise<{ studentId: string, studentName: string, finalGrade: number}[]> { // Returning an array of student ID, name and grade

  
  const studentURL = `https://spark-se-assessment-api.azurewebsites.net/api/class/listStudents/${classID}?buid=U22651662`;
  const studentHeaders = {
    'Accept': 'application/json',
    'x-functions-key': '6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ=='
  }
  const studentResponse = await fetch(studentURL, 
    {
      method: 'GET',
      headers: studentHeaders
    });
  
  const students: IStudent[] = await studentResponse.json();

  const classURL = `https://spark-se-assessment-api.azurewebsites.net/api/class/GetById/${classID}?buid=U22651662`;
  const classResponse = await fetch(classURL,
    {
      method: 'GET',
      headers: studentHeaders
    });
  const klass: IUniversityClass = await classResponse.json();

  const studentGrades: {studentId: string, studentName: string, finalGrade: number }[] = [];
  
  const assignmentURL = `https://spark-se-assessment-api.azurewebsites.net/api/class/listAssignments/${classID}?buid=U22651662`
  const assignmentResponse = await fetch(assignmentURL, 
    {
      method: 'GET',
      headers: studentHeaders
    });

  const assignments: IAssignment[] = await assignmentResponse.json();

  const assignmentWeights: { [key: string]: number} = {};

  for (const assignment of assignments) {
    assignmentWeights[assignment.assignmentId] = assignment.weight;
  }

  for (const student of students) {
    const studentID = student.universityId;
    const gradeURL = `https://spark-se-assessment-api.azurewebsites.net/api/student/listGrades/${studentID}/${classID}/?buid=U22651662`;
    const gradeResponse = await fetch(gradeURL, 
      {
        method: 'GET',
        headers: studentHeaders
      });

    const grades: IGrades = await gradeResponse.json();
    const finalGrade = await calculateStudentFinalGrade(studentID, assignments, klass, grades);
    
    studentGrades.push({
      studentId: studentID,
      studentName: student.name,
      finalGrade: finalGrade
    });
  }



  return studentGrades;
}
