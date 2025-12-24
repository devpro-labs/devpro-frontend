import { API } from "@/lib/const/api";
import backendRoute from "@/lib/const/backend_route";
import { Response } from "@/lib/const/response";

const fetchProblems = async (
  token?: string
): Promise<Response> => {
  const api = await API(token);
  const response = await api.get(backendRoute.problems.getAllProblems);
  return response.data;
}

const fetchSampleTestCases = async (
  token: string,
  id: string
): Promise<Response> => {
  const api = await API(token);
  const response = await api.get(backendRoute.testcases.getSampleTestcasesByProblemId(id));
  return response.data;
} 

const runCode = async (
  token: string,
  problemId: string,
  code: string,
  image_name: string,
  file_name: string,
  libOrFramework: string
): Promise<Response> => {
  const api = await API(token);
  const response = await api.post(backendRoute.code.runCode(problemId),{
    code,
    image_name,
    file_name,
    libOrFramework
  })

  return response.data;
}

export { fetchProblems, fetchSampleTestCases, runCode };

