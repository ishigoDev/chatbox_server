'use strict';
const {
  Model
} = require('sequelize');
const Op = require('sequelize').Op
let allModels;
module.exports = (sequelize, DataTypes) => {
  class chatroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        as: 'created',
        foreignKey: 'created_by'
      }),
        this.hasMany(models.messages, {
          as: 'messages',
          foreignKey: 'chatroom_id'
        })
    }
  }
  chatroom.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
    },
    created_by: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    members: {
      type: DataTypes.ARRAY({
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      }),
    }
  }, {
    sequelize,
    modelName: 'chatroom',
    paranoid: true,
    tableName: 'chatrooms',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  chatroom.registerAllModels = function (models) {
    allModels = models;
  };
  chatroom.checkChatRoomId = async function (sender, receiver) {
    const checkChatRoomId = await chatroom.findOne({
      where: {
        [Op.or]:[
          {
            [Op.and]: [
              {
                created_by: sender
              },
              {
                members: {
                  [Op.contains]: [receiver]
                }
              }
            ]
          },
          {
            [Op.and]: [
              {
                created_by: receiver
              },
              {
                members: {
                  [Op.contains]: [sender]
                }
              }
            ]
          }
        ]
        
      }
    })
    return checkChatRoomId;
  }
  chatroom.createMember = async function (data) {
    const { body } = data;
    const { sender, receiver } = data.params;
    const check = await this.checkChatRoomId(sender, receiver);
    let chatroomRow;
    let chatRoomId;
    if (!check) {
      chatroomRow = await chatroom.create({
        created_by: sender,
        members: [receiver],
      });
      chatRoomId = chatroomRow.dataValues.id;
    } else {
      chatRoomId = check.dataValues.id
    }
    const messageCreated = await allModels.messages.saveMessage(chatRoomId, sender, body.message);    
    return messageCreated;
  }
  return chatroom;
};