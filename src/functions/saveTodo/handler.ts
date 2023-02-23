import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DynamoDB } from 'aws-sdk';
import {v4 as uuidv4} from 'uuid'
import { format } from 'date-fns'

import schema from './schema';
import ptBR from 'date-fns/locale/pt-BR';

const dynamoDB = new DynamoDB.DocumentClient()

const getErrorResponse = (errorMessage: string) => {

  return {
    statusCode: 500,
    body: JSON.stringify({
      message: errorMessage,
    })
  }
}

const saveTodo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const { title, description } = event.body

  try{

    const params = {
      TableName: 'TodosTable',
      Item: {
        todosId: uuidv4(),
        title,
        description,
        status: false,
        createdAt: format(new Date(), 'dd/MM/yyyy HH:mm:ss', {locale: ptBR })
      }
    }

    await dynamoDB.put(params).promise()

    return {
      statusCode: 201,
      body: JSON.stringify(params.Item)
    }

  } catch (err){

    console.log(err)
    return getErrorResponse(err);

  }

};

const getTodos: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {

  try{

      const params = {
        TableName: 'TodosTable',
      }
      const todosData = await dynamoDB.scan(params).promise()

      return{
        statusCode: 200,
        body: JSON.stringify(todosData.Items)
      }
    }

  catch(err) {
    console.log(err)
    return getErrorResponse(err);
  }

}

const getTodo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const { id } = event.pathParameters

  try{

      const params = {
        TableName: 'TodosTable',
        Key: {
          todosId: id
        }
      }

      const todoData = await dynamoDB.get(params).promise()

      return{
        statusCode: 200,
        body: JSON.stringify(todoData.Item)
      }
    }

  catch(err) {
    console.log(err)
    return getErrorResponse(err);
  }

}

const updateTodo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const { id } = event.pathParameters

  try{

      const params = {
        TableName: 'TodosTable',
        Key: {
          todosId: id
        },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": true,
        },
        ReturnValues: "ALL_NEW",
      }

      await dynamoDB.update(params).promise()

      return{
        statusCode: 200,
        body: JSON.stringify({
          message: 'Atualizado com sucesso!'
        })
      }
    }

  catch(err) {
    console.log(err)
    return getErrorResponse(err);
  }

}

const deleteTodo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const { id } = event.pathParameters

  try{

      const params = {
        TableName: 'TodosTable',
        Key: {
          todosId: id
        }
      }

      await dynamoDB.delete(params).promise()

      return{
        statusCode: 200,
        body: JSON.stringify({
          message: 'Deletado com sucesso!'
        })
      }
    }

  catch(err) {
    console.log(err)
    return getErrorResponse(err);
  }

}

export const main = middyfy(saveTodo);
export const getAllTodos = middyfy(getTodos);
export const getOneTodo = middyfy(getTodo)
export const updateOneTodo = middyfy(updateTodo)
export const deleteOneTodo = middyfy(deleteTodo)