import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const insertData = async () => {
  await prisma.task.create({
    data: {
      name: "Task_1",
      description: "Task_description",
      teams: {
        create: [
          {
            name: "Team_1",
            employees: {
              create: [
                {
                  name: "Emp_1",
                  email: "emp1@gmail.com",
                },
                {
                  name: "Emp_2",
                  email: "emp2@gmail.com",
                },
                {
                  name: "Emp_3",
                  email: "emp3@gmail.com",
                },
              ],
            },
          },
          {
            name: "Team_2",
            employees: {
              create: [
                {
                  name: "Emp_4",
                  email: "emp4@gmail.com",
                },
                {
                  name: "Emp_5",
                  email: "emp5@gmail.com",
                },
                {
                  name: "Emp_6",
                  email: "emp6@gmail.com",
                },
              ],
            },
          },
        ],
      },
    },
  });
};

const getTasks = async () => {
  const tasks = await prisma.task.findMany({
    include: {
      teams: {
        include: {
          employees: true,
        },
      },
    },
  });

  console.dir(tasks, { depth: null });
};

const getTeams = async (teamName: string) => {
  const teams = await prisma.team.findMany({
    where: {
      name: teamName,
    },
    include: {
      employees: true,
    },
  });

  console.dir(teams, { depth: null });
};

const addEmpToTeam = async (
  teamName: string,
  empName: string,
  empEmail: string
) => {
  const team = await prisma.team.findUnique({
    where: {
      name: teamName,
    },
  });
  await prisma.employee.create({
    data: {
      name: empName,
      email: empEmail,
      team: {
        connect: {
          id: team?.id,
        },
      },
    },
  });
  console.log(`Employee ${empName} added to team ${teamName}`)
};

const deleteEmp = async (empName: string) => {
  await prisma.employee.delete({
    where: {
      name: empName,
    },
  });
  console.log(`Employee ${empName} deleted`)
};

const updateEmpMail = async (empName: string, newMail: string) => {
  await prisma.employee.update({
    where: {
      name: empName,
    },
    data: {
      email: newMail,
    },
  });
  console.log(`Employee ${empName} mail updated`);
};

const main = async () => {
  await insertData();
//   await getTasks();
//   await getTeams("Team_1");
//   await addEmpToTeam("Team_1", "Parthib", "emp@123");
//   await deleteEmp("Parthib");
//   await updateEmpMail("Emp_1", "hello@123");
  await getTeams("Team_1");
};

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
