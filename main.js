const lines = require("fs")
  .readFileSync(0, "utf-8")
  .split("\n")
  .filter((l) => l.trim() !== "");

class AppError extends Error {
  // TODO: constructor(message, status, cause); name must be the class's own name
  constructor(message, status, cause) {
    super(message);
    this.status = status;
    this.cause = cause;
    this.name = new.target.name;
  }
}

class NotFoundError extends AppError {
  // TODO: constructor(kind, id) -> message "<kind> <id> not found", status 404
  constructor(kind, id) {
    super(`${kind} ${id} not found`, 404);
    this.kind = kind;
    this.id = id;
  }
}

class ValidationError extends AppError {
  // TODO: constructor(field, problem) -> message "<field> <problem>", status 400
  constructor(field, problem) {
    super(`${field} ${problem}`, 400);
    this.field = field;
  }
}

const users = { 1: "ann", 2: "bob" };

function getUser(id) {
  if (!Object.prototype.hasOwnProperty.call(users, id))
    throw new NotFoundError("user", id);
  return users[id];
}

function createUser(name, age) {
  const n = Number(age);
  if (!Number.isInteger(n))
    throw new ValidationError("age", "must be a whole number");
  if (n < 0) throw new ValidationError("age", "must not be negative");
  if (name === "root") throw new Error("reserved name");
  return name + " (" + n + ")";
}

function loadConfig(text) {
  try {
    return Object.keys(JSON.parse(text)).length + " keys";
  } catch (inner) {
    throw new AppError("config is not valid JSON", 500, inner);
  }
}

function run(line) {
  const space = line.indexOf(" ");
  const cmd = space === -1 ? line : line.slice(0, space);
  const rest = space === -1 ? "" : line.slice(space + 1);
  if (cmd === "get") return getUser(rest);
  if (cmd === "create")
    return createUser(rest.split(" ")[0], rest.split(" ")[1]);
  if (cmd === "config") return loadConfig(rest);
  throw new AppError("maintenance", 503);
}

function describe(err) {
  let extra = "none";
  if (err instanceof NotFoundError)
    extra = "kind=" + err.kind + " id=" + err.id;
  else if (err instanceof ValidationError) extra = "field=" + err.field;
  else if (err.cause !== undefined) extra = "cause=" + err.cause.name;
  return String(err) + " | " + err.status + " | " + extra;
}

for (const line of lines) {
  try {
    console.log("OK " + run(line));
  } catch (err) {
    console.log(
      err instanceof AppError ? describe(err) : "UNEXPECTED " + String(err),
    );
  }
}
