'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const paketData = [];
    const numPakets = 10; // Change the number of pakets as needed

    for (let i = 0; i < numPakets; i++) {
      const paket = {
        tanggal_berangkat: faker.date.future(),
        awalan: "Indonesia",
        tujuan: faker.address.country(),
        harga: faker.datatype.number(10) * 100 + '000',// 52,
        type: "Pesawat",

        createdAt: new Date(),
        updatedAt: new Date()
      };
      paketData.push(paket);
    }

    await queryInterface.bulkInsert('Pakets', paketData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Pakets', null, {});
  }
};
