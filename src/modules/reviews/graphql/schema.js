
import { GraphQLSchema, GraphQLObjectType,GraphQLString, GraphQLID, GraphQLList, GraphQLInt } from 'graphql';
import reviewmodel from '../../../../db/models/reviewmodel.js';
import { authgraphql } from '../../../middleware/auth.js';
import { systemroles } from '../../../utils/systemroles.js';

 
  
 export const reviewschema=new GraphQLSchema({
    query:new GraphQLObjectType({
        name:"query",
        fields:{
            getreview:{
              type:new GraphQLObjectType({
                    name:"review",
                    fields:{
                        comment:{type:GraphQLString},
                        rate:{type:GraphQLInt},
                        productId:{type:GraphQLID},
                        createdBy:{type:GraphQLID},
                    }
                }),
                args:{
                    id:{type:GraphQLID}
                },
                resolve:async(_,args)=>{
                    const review=await reviewmodel.findOne({_id:args.id})
                    return review
                }
            },
            getreviews:{
                type:new GraphQLList(new GraphQLObjectType({
                    name:"reviews",
                    fields:{
                        comment:{type:GraphQLString},
                        rate:{type:GraphQLInt},
                        productId:{type:GraphQLID},
                        createdBy:{type:GraphQLID},
                    }
                })),
                resolve:async()=>{
                    const reviews=await reviewmodel.find({})
                    return reviews
                }
            }
        }
    }),
    mutation:new GraphQLObjectType({
        name:"mutation",
        fields:{
            postreview:{
              type:new GraphQLObjectType({
                    name:"postreview",
                    fields:{
                        comment:{type:GraphQLString},
                        rate:{type:GraphQLInt},
                        productId:{type:GraphQLID},
                        createdBy:{type:GraphQLID},
                    }
                }),
                args:{
                    comment:{type:GraphQLString},
                        rate:{type:GraphQLInt},
                        productId:{type:GraphQLID},
                        createdBy:{type:GraphQLID},
                    token:{type:GraphQLString},

                },
                resolve:async(_,args)=>{
                    const{comment,rate,productId,createdBy,token}=args
                    const user = await authgraphql(token,systemroles.user)
                    const review=await reviewmodel.create({comment,rate,productId,createdBy })
                    return review
                }
            },
            updatereview:{
                type:new GraphQLObjectType({
                      name:"updatereview",
                      fields:{
                          comment:{type:GraphQLString},
                          rate:{type:GraphQLInt},
                          productId:{type:GraphQLID},
                          createdBy:{type:GraphQLID},
                      }
                  }),
                  args:{
                    id:{type:GraphQLID},
                      comment:{type:GraphQLString},
                          rate:{type:GraphQLInt},
                          productId:{type:GraphQLID},
                          createdBy:{type:GraphQLID},
                  },
                  resolve:async(_,args)=>{
                      const{id,comment,rate,productId,createdBy}=args
                      const review=await reviewmodel.findOneAndUpdate({_id:id},{comment,rate,productId,createdBy })
                      return review
                  }
              },
        }
    })
 })