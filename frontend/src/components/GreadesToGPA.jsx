import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { RainbowButton } from "./ui/rainbow-button";
import { InteractiveHoverButton } from "./ui/interactive-hover-button";

const gradePoints = {
  EX: 10,
  AA: 9.0,
  AB: 8.5,
  BB: 8.0,
  BC: 7.5,
  CC: 7.0,
  CD: 6.5,
  DD: 6.0,
  DE: 5.5,
  EE: 5.0,
  FF: 0.0,
};

export default function GradesToGPA() {
  const [courses, setCourses] = useState([{ credits: "", grade: "" }]);
  const [sgpa, setSgpa] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Handle input changes without affecting calculation
  const handleInputChange = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    setCourses(updatedCourses);
  };

  // ✅ Only adds a new course; does NOT trigger CGPA calculation
  const addCourse = () => {
    setCourses([...courses, { credits: "", grade: "" }]);
  };

  // ✅ Only runs when "Calculate SGPA" is clicked
  const calculateSGPA = (e) => {
    e.preventDefault();

    let totalCredits = 0;
    let totalGradePoints = 0;
    let isValid = false;

    for (const course of courses) {
      const credit = parseFloat(course.credits);
      const grade = course.grade;
      if (credit && grade) {
        totalCredits += credit;
        totalGradePoints += credit * gradePoints[grade];
        isValid = true; // At least one valid course exists
      }
    }

    // If no valid inputs at all → show error
    if (!isValid) {
      setError("Please enter valid credits and select a grade for at least one course.");
      setSgpa(null);
      return;
    }

    // If valid → calculate SGPA
    setError(null);
    const calculatedSGPA = totalGradePoints / totalCredits;
    setSgpa(calculatedSGPA.toFixed(2));
  };

  return (
    <div className="flex flex-col items-center justify-center p-5 sm:p-8 w-full max-w-4xl mx-auto">
      <form onSubmit={calculateSGPA} className="w-full">
        <table className="border-collapse border border-gray-600 w-full text-sm sm:text-base">
          <thead>
            <tr className="text-gray-300">
              <th className="border border-gray-400 p-3 text-center">Course#</th>
              <th className="border border-gray-400 p-3 text-center">Credits</th>
              <th className="border border-gray-400 p-3 text-center">Grades</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-400 p-3 text-white">Course {index + 1}</td>
                <td className="border border-gray-400 p-3">
                  <Input
                    placeholder="Enter Credits"
                    type="number"
                    className="w-full p-2 rounded-md border border-gray-300"
                    value={course.credits}
                    onChange={(e) => handleInputChange(index, "credits", e.target.value)}
                  />
                </td>
                <td className="border border-gray-400 p-3">
                  <Select
                    value={course.grade}
                    onValueChange={(value) => handleInputChange(index, "grade", value)}
                  >
                    <SelectTrigger className="w-full p-2 rounded-md border border-gray-300">
                      <SelectValue placeholder="Select Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(gradePoints).map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Error message */}
        {error && (
          <div className="text-red-500 mt-4 text-center">{error}</div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 w-full">
          <button
            type="button" // Explicitly set type to "button" to prevent form submission
            className="w-full sm:w-auto px-4 py-2"
            onClick={addCourse}
          >
            <InteractiveHoverButton>Add Course</InteractiveHoverButton>
          </button>

          <button type="submit" className="w-full sm:w-auto px-4 py-2">
            <RainbowButton>Calculate SGPA</RainbowButton>
          </button>
        </div>
      </form>

      {sgpa !== null && !error && (
        <div className="mt-6 text-lg sm:text-xl font-bold text-white text-center">
          Your GPA: <span className="text-green-500">{sgpa}</span>
        </div>
      )}
    </div>
  );
}