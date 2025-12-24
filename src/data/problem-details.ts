import { ProblemDetail } from "@/lib/types";
import { expressJwtAuth } from "./problems/express-1";
import { expressCrudApi } from "./problems/express-2";
import { fastapiRestApi } from "./problems/fastapi-1";
import { fastapiValidation } from "./problems/fastapi-2";
import { springbootRestApi } from "./problems/springboot-1";
import { springbootJwtAuth } from "./problems/springboot-2";

export const allProblemDetails:Array<ProblemDetail> = [
  expressJwtAuth, expressCrudApi, fastapiValidation, fastapiRestApi, springbootJwtAuth, springbootRestApi 
]