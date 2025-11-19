package com.example.medrecords.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MongoConfig {

    @Bean
    public GridFSBucket gridFSBucket(MongoClient mongoClient) {
        // Replace "medrecords" with your actual database name
        MongoDatabase database = mongoClient.getDatabase("medrecords");
        return GridFSBuckets.create(database);
    }
}
