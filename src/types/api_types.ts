/**
 * This file can be used to store types and interfaces for data received from the API.
 * It's good practice to name your interfaces in the following format:
 * IMyInterfaceName - Where the character "I" is prepended to the name of your interface.
 * This helps remove confusion between classes and interfaces.
 */

/**
 * This represents a class as returned by the API
 */

// CITE: https://stackoverflow.com/questions/37233735/interfaces-vs-types-in-typescript
// Used this resource to understand when to use interface and types. Ended up sticking with just using interfaces

export interface IUniversityClass {
  classId: string;
  title: string;
  description: string;
  meetingTime: string;
  meetingLocation: string;
  status: 'active' | 'inactive'; // Two possible status for a class
  semester: string;
}

export interface IAssignment {
  assignmentId: string;
  classId: string;
  date: string;
  weight: number;
}

export interface IGrades {
  classId: string;
  grades: { [key : string]: number }; // Grades stored as a key-value pair: assignmentId as key and grade as value
  name: string;
  studentId: string;
}

export interface IStudent {
  dateEnrolled: string;
  name: string;
  status: 'enrolled' | 'graduated' | 'other'; // All possible statuses 
  universityId: string;
}

// Setting up the GradeTable was helped with ChatGPT
export interface IGradeTableProps {
  grades: { id: string; studentName: string; finalGrade: number }[];
}