module.exports = function (models) {
  
  models.User.bulkCreate([
    {
      userName: "test1@test.com",
      password: "test1",
      nickName: "Test"
    },
    {
      userName: "test2@test.com",
      password: "test2",
      nickName: "Probe"
    },
    {
      userName: "test3@test.com",
      password: "test3",
      nickName: "Prueba"
    }
  ])

  .then(function (dbusers) {
    const users = dbusers;
    
    models.List.bulkCreate([
      {
        title: "Test's List",
        category: "Shared",
        creatorId: 1
      },
      {
        title: "Probe's List",
        category: "Private",
        creatorId: 2
      }
    ])

    .then(function (dblists) {
      const lists = dblists;

      models.Task.bulkCreate([
        {
          text: "1 gal. Horizon organic whole milk",
          originatorId: 1,
          listId: 1
        },
        {
          text: "5 Chiquita bananas",
          originatorId: 2,
          listId: 1
        },
        {
          text: "5 oz. baby kale",
          originatorId: 2,
          listId: 2
        },
        {
          text: "Tampax tampons",
          originatorId: 2,
          listId: 2
        }
      ])
      
      .then(function(/*dbtasks*/) {
        lists[0].addCheri(users[2]);
        lists[1].addCheri(users[2]);
      });
    
    });

  });
  
};