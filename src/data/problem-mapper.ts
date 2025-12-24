import { Problem, ProblemDetail } from "@/lib/types";
import { dummyProblems } from "./problems";
import { allProblemDetails } from "./problem-details";

export const useProblem = (slug: string): {problem: Problem, details: ProblemDetail} | undefined => {
  
  const p: Problem|undefined = dummyProblems.find((problem) => problem.slug === slug);

  if(p == undefined) return undefined;
 
  let pro: {problem: Problem, details: ProblemDetail} | undefined = undefined;
  
  allProblemDetails.forEach((detail) => {
    if(detail.slug === slug){
      pro = {problem: p as Problem, details: detail};
    }
  });
  if(pro == undefined) return undefined;

  return pro;
  
}