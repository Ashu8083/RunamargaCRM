# backend/app/models/__init__.py
from app.models.roles import Role
from app.models.states import State
from app.models.cities import City
from app.models.contexts import Context
from app.models.languages import Language
from app.models.permissions import Permission
from app.models.auth_tokens import AuthToken
from app.models.employees import Employee
from app.models.employee_details import EmployeeDetails
from app.models.employee_contexts import EmployeeContext
from app.models.employee_context_permissions import EmployeeContextPermission
from app.models.employee_face_profiles import EmployeeFaceProfile
from app.models.loan_types import LoanType
from app.models.bank import Bank
from app.models.banker_directories import BankerDirectory
from app.models.banker_directory_asms import BankerDirectoryASM
from app.models.banker_directory_sms import BankerDirectorySM
from app.models.dsa_details import DSADetail
from app.models.loan_applications import LoanApplication
from app.models.loan_addresses import LoanAddress
from app.models.loan_reference import LoanReference
from app.models.loan_coapplicant import LoanCoApplicant
from app.models.loan_document import LoanDocument
from app.models.employee_roles import EmployeeRole
from app.models.reverted_loans import RevertedLoan
from app.models.attendance import Attendance
from app.models.bank_processings import BankProcessing
from app.models.team_chat import TeamChat
from app.models.call_logs import CallLog
from app.models.call_assignments import CallAssignment


from app.models.duplicate_approvals import DuplicateApproval
from app.models.phone_numbers import PhoneNumber



