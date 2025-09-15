import {User} from "@prisma/client";

export const users: User[] = [
  {
    id: 1,
    email: "ninja@progate.com",
    name: "ninja",
    password: "$2b$10$qxbZqGD/ENrNFx9I0KvxeewDgGDMxijzCRsM3s.IbYiMiQ1Kvxfba",
    createdAt: new Date(2020, 0, 1),
    updatedAt: new Date(2020, 0, 1),
  },
  {
    id: 2,
    email: "baby@progate.com",
    name: "baby",
    password: "$2b$10$qxbZqGD/ENrNFx9I0KvxeewDgGDMxijzCRsM3s.IbYiMiQ1Kvxfba",
    createdAt: new Date(2020, 0, 1),
    updatedAt: new Date(2020, 0, 1),
  },
];
