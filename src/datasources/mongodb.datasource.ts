import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'mongodb',
  connector: 'mongodb',
  url: process.env.MONGO_URL,
  useNewUrlParser: true,
  useUnifiedTopology: true

};

console.log(config)

@lifeCycleObserver('datasource')
export class MongodbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mongodb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongodb', {optional: true})
    dsConfig: object = config,
  ) {

    try {
      console.log("conexion exitosa a mongo");
    super(dsConfig);
  }
  catch (error) {
    console.log("error en la conexion a mongo");
    console.log(error);
  }
  }
}
