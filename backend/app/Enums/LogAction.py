from enum import Enum


class LogAction(str, Enum):
    create = "create"
    update = "update"
    delete = "delete"