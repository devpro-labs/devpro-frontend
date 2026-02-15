import { API } from "@/lib/const/api";
import backendRoute from "@/lib/const/backend_route";
import { Response } from "@/lib/const/response";
import { Submission, SubmissionApiResponse } from "@/lib/types";
import { FileItem } from "./right-panal/file-explorer";

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
  console.log("testcase fetching for problem id:", id);
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
  libOrFramework: string,
  files: FileItem[],
): Promise<Response> => {
  console.log("Running code with file tree:", files);
  const api = await API(token);
  const response = await api.post(backendRoute.code.runCode(problemId), {
    code,
    image_name,
    file_name,
    libOrFramework,
    files: files,
  })

  return response.data;
}

const submitCode = async (
  token: string,
  problemId: string,
  code: string,
  image_name: string,
  file_name: string,
  libOrFramework: string,
  files: FileItem[],
): Promise<Response> => {
  console.log("Running code with file tree:", files);
  const api = await API(token);
  const response = await api.post(backendRoute.code.submitCode(problemId), {
    code,
    image_name,
    file_name,
    libOrFramework,
    files: files,
  })

  return response.data;
}

const fetchSubmissions = async (
  token: string,
  problemId: string
): Promise<Submission[]> => {
  const api = await API(token);
  const response = await api.get(backendRoute.submission.getSubmissions(problemId));
  const data: SubmissionApiResponse = response.data;

  if (data.ERROR) {
    throw new Error(data.ERROR);
  }

  return data.DATA?.submission || [];
}

export { fetchProblems, fetchSampleTestCases, runCode, submitCode, fetchSubmissions };

