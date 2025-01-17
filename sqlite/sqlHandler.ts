import Dexie from 'dexie';
import { Document, Entity, Topic, Keyword, DocumentAnalysis, NodeModel, DocumentDetail, DocumentConnection, IDocumentConnection } from '../model';


class TextAnalysisDB extends (Dexie as any) {
    constructor() {
        super('TextAnalysisDB');
        this.version(1).stores({
            documents: '++id, documentId, lastAnalyzed',
            entities: '++id, documentId, text, type, weight, [documentId+text]',
            topics: '++id, documentId, name, weight, [documentId+name]',
            keywords: '++id, documentId, keyword, weight, [documentId+keyword]',
            sentiments: '++id, documentId, overallSentiment, weight',
            documentConnections: '++id, documentId, connectedDocumentId, connectionType, sharedAttributes, weight',
        });
    }
}

export const db = new TextAnalysisDB();

export async function initializeDatabase() {
    console.log('Database initialized'); 
}

export async function logDatabaseContent() {
    const allDocuments = await db.documents.toArray();
    console.log("Documents table content:", allDocuments);
  
    const allEntities = await db.entities.toArray();
    console.log("Entities table content:", allEntities);
  
    const allTopics = await db.topics.toArray();
    console.log("Topics table content:", allTopics);
  
    const allKeywords = await db.keywords.toArray();
    console.log("Keywords table content:", allKeywords);
  
    const allSentiments = await db.sentiments.toArray();
    console.log("Sentiments table content:", allSentiments);

    const allConnections = await db.documentConnections.toArray();
    console.log("Connections table content:", allConnections);

    console.log(fetchDetailedDocumentData());

  }


export async function saveAnalysisResults(leafId: any, apiResponse: any) {
    let analysisResponse;
    try {
        console.log('API response in sqlhandler:', apiResponse);
        analysisResponse = JSON.parse(apiResponse); // Assuming apiResponse.content is a JSON string
    } catch (error) {
      console.error("Failed to parse API response:", error);
      return;
    }
  
    // Save Document ID and Last Analyzed timestamp
    await db.documents.add({ documentId: leafId, lastAnalyzed: new Date() });

    // Save Named Entities
    if (analysisResponse.namedEntityRecognition?.entities) {
      for (const entity of analysisResponse.namedEntityRecognition.entities) {
        await db.entities.add({ ...entity, documentId: leafId });
      }
    }

    // Save Topic Modeling
    if (analysisResponse.topicModeling?.topics) {
        for (const topic of analysisResponse.topicModeling.topics) {
            await db.topics.add({ ...topic, documentId: leafId });
        }
    }

    // Save Keyword Extraction
    if (analysisResponse.keywordExtraction?.keywords) {
        for (const keyword of analysisResponse.keywordExtraction.keywords) {
            await db.keywords.add({ ...keyword, documentId: leafId });
        }
    }

    // Sentiment Analysis can be a single record related to the document; assuming only one sentiment analysis result per document
    if (analysisResponse.sentimentAnalysis) {
        const { overallSentiment, weight } = analysisResponse.sentimentAnalysis;
        // Assuming a sentiment table or you can choose to add these fields to the documents table
        await db.sentiments.add({ documentId: leafId, overallSentiment, weight });
    }
  
    // Add similar checks and loops for topics, keywords, etc.
    console.log('Analysis results saved for leaf ID:', leafId);
  }

  export async function checkIfLeafExistsInDatabase(leafId: string): Promise<boolean> {
    const leaf = await db.documents.where('documentId').equals(leafId).first();
    // If the leaf exists in the database, return true
    if (leaf !== undefined) {
      return true;
    }
    // If the leaf does not exist in the database, return false
    return false;
  }

  export async function saveConnectionAnalysisResults(analysisResults: any) {
    try {
        console.log('Analysis results in sqlHandler:', analysisResults);
        for (const docResult of analysisResults.analysis) {
            const documentId = docResult.documentId;
            const connections = docResult.connections;

            for (const connectionType in connections) {
                const connectionList = connections[connectionType];
                for (const connection of connectionList) {
                    await db.documentConnections.add({
                        documentId,
                        connectedDocumentId: connection.connectedDocumentId,
                        connectionType,
                        sharedAttributes: connection.sharedAttributes,
                        weight: connection.medianWeight
                    });
                }
            }
        }
        console.log("Connections successfully saved to the database.");
    } catch (error) {
        console.error("Failed to save connection analysis results:", error);
        throw new Error("Error saving connection results to the database: " + error.message);
    }
}


export async function fetchAllDocumentIds(): Promise<string[]> {
  const documents = await db.documents.toArray();
  return documents.map((doc: { documentId: any; }) => doc.documentId);
}


  export async function fetchAllDocumentData(): Promise<DocumentAnalysis[]> {
    const documents: Document[] = await db.documents.toArray();
    const entities: Entity[] = await db.entities.toArray();
    const topics: Topic[] = await db.topics.toArray();
    const keywords: Keyword[] = await db.keywords.toArray();

    // Organize data by document
    const documentAnalysis: DocumentAnalysis[] = documents.map(doc => ({
        id: doc.documentId,
        keywords: keywords.filter((k: Keyword) => k.documentId === doc.documentId),
        entities: entities.filter((e: Entity) => e.documentId === doc.documentId),
        topics: topics.filter((t: Topic) => t.documentId === doc.documentId)
    }));

    console.log('Document analysis fetched:', documentAnalysis);
    return documentAnalysis;
}

export async function fetchDetailedDocumentData(): Promise<DocumentDetail[]> {
  const documents = await db.documents.toArray();
  const detailedDocuments: DocumentDetail[] = [];

  for (const document of documents) {
      const entities = await db.entities.where({ documentId: document.documentId }).toArray();
      const topics = await db.topics.where({ documentId: document.documentId }).toArray();
      const keywords = await db.keywords.where({ documentId: document.documentId }).toArray();
      const sentiments = await db.sentiments.where({ documentId: document.documentId }).toArray();
      const connections = await db.documentConnections.where({ documentId: document.documentId }).toArray();

      // Aggregate all related data into a single object for this document
      detailedDocuments.push({
          ...document,
          entities,
          topics,
          keywords,
          sentiments,
          connections: connections.map((conn: { connectedDocumentId: any; }) => ({
              ...conn,
              connectedDocument: documents.find((d: { documentId: any; }) => d.documentId === conn.connectedDocumentId) || null
          }))
      });
  }
  console.log('Detailed document data fetched:', detailedDocuments);
  return detailedDocuments;
}

export async function fetchDocumentDataById(documentId: string): Promise<DocumentDetail | null> {
  const document = await db.documents.where({ documentId }).first();
  if (!document) return null;

  const entities = await db.entities.where({ documentId }).toArray();
  const topics = await db.topics.where({ documentId }).toArray();
  const keywords = await db.keywords.where({ documentId }).toArray();
  const sentiments = await db.sentiments.where({ documentId }).toArray();
  const connections = await db.documentConnections.where({ documentId }).toArray();

  // Aggregate all related data into a single object for this document
  return {
      ...document,
      entities,
      topics,
      keywords,
      sentiments,
      connections: connections.map(async (conn: { connectedDocumentId: any; }) => ({
          ...conn,
          connectedDocument: (await db.documents.where({ documentId: conn.connectedDocumentId }).first()) || null
      }))
  };
}

/**
 * CRUD OPERATIONS FOR ENTITY
 */
export async function fetchEntitiesByDocumentId(documentId: string): Promise<Entity[]> {
  return await db.entities.where({ documentId }).toArray();
}

export async function updateEntity(documentId: string, updatedEntity: any) {
  await db.entities.update(updatedEntity.id, { ...updatedEntity, documentId });
}

export async function deleteEntity(documentId: string, entityId: number) {
  await db.entities.delete(entityId);
}

export async function addEntity(documentId: string, entity: any) {
  await db.entities.add({ ...entity, documentId });
}

/**
 * CRUD OPERATIONS FOR KEYWORD
 */
export async function fetchKeywordsByDocumentId(documentId: string): Promise<Keyword[]> {
  return await db.keywords.where({ documentId }).toArray();
}

export async function updateKeyword(documentId: string, updatedKeyword: any) {
  await db.keywords.update(updatedKeyword.id, { ...updatedKeyword, documentId });
}

export async function deleteKeyword(documentId: string, keywordId: number) {
  await db.keywords.delete(keywordId);
}

export async function addKeyword(documentId: string, keyword: any) {
  await db.keywords.add({ ...keyword, documentId });
}

/**
 * CRUD OPERATIONS FOR TOPIC
 */
export async function fetchTopicsByDocumentId(documentId: string): Promise<Topic[]> {
  return await db.topics.where({ documentId }).toArray();
}

export async function updateTopic(documentId: string, updatedTopic: any) {
  await db.topics.update(updatedTopic.id, { ...updatedTopic, documentId });
}

export async function deleteTopic(documentId: string, topicId: number) {
  await db.topics.delete(topicId);
}

export async function addTopic(documentId: string, topic: any) {
  await db.topics.add({ ...topic, documentId });
}

/**
 * CRUD OPERATIONS FOR CONNECTIONS
 */
// Add a connection
export async function addConnection(documentId: string, connection: IDocumentConnection): Promise<void> {
  await db.documentConnections.add({ ...connection, documentId });
}

// Fetch connections by document ID
export async function fetchConnectionsByDocumentId(documentId: string): Promise<IDocumentConnection[]> {
  const connections = await db.documentConnections.where({ documentId }).toArray();
  const detailedConnections = await Promise.all(connections.map(async (conn: IDocumentConnection) => ({
    ...conn,
    connectedDocument: await db.documentConnections.where({ documentId: conn.connectedDocumentId }).first()
  })));
  return detailedConnections;
}

// Delete a shared attribute
export async function deleteSharedAttribute(documentId: string, connectedDocumentId: string, attribute: string): Promise<void> {
  const connection = await db.documentConnections.where({ documentId, connectedDocumentId }).first();
  if (connection) {
    const updatedAttributes = connection.sharedAttributes.filter((attr: string) => attr !== attribute);
    if (updatedAttributes.length === 0) {
      await db.documentConnections.delete(connection.id);
    } else {
      await db.documentConnections.update(connection.id, { sharedAttributes: updatedAttributes });
    }
  }
}


// Update a connection
export async function updateConnection(updatedConnection: IDocumentConnection): Promise<void> {
  await db.documentConnections.update(updatedConnection.id, updatedConnection);
}




export async function dropConnections() {
  await db.transaction('rw', db.documentConnections, async () => {
    await db.documentConnections.clear();
  });
}


  export async function clearDatabase() {
    await db.transaction('rw', db.documents, db.entities, db.topics, db.keywords, db.sentiments, db.documentConnections, async () => {
      await db.documents.clear();
      await db.entities.clear();
      await db.topics.clear();
      await db.keywords.clear();
      await db.sentiments.clear();
      await db.documentConnections.clear();
    });
    console.log('Database cleared');
  }
  
