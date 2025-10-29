import { db } from "../firebaseConfig";
import { addDoc, collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";

export type Post = {
    caption: string,
    image: string,
    createdAt: Date,
    createdBy: string,
}

export type PostWithId = {
    id: string,
    caption: string,
    image: string,
    createdAt: Date,
    createdBy: string, 
}

const posts = collection(db, "posts");

async function addPost(post: Post) {
    await addDoc(posts, post);
}

async function allPosts(pageSize = 25, lastDoc = null) {
    try {
        let q;
        if (lastDoc) {
            q = query(
                posts,
                orderBy("createdAt", "asc"),
                startAfter(lastDoc),
                limit(pageSize),
            );
        } else {
            q = query(
                posts,
                orderBy("createdAt", "asc"),
                limit(pageSize),
            );
        }
        
        const snapshot = await getDocs(q);
        if (!snapshot || !snapshot.docs || snapshot.docs.length === 0) {
            return { allPosts: [], lastDoc: null };
        }
        const lastVisable = snapshot.docs[snapshot.docs.length - 1];
        
        const allPosts: PostWithId[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                caption: data.caption,
                image: data.image,
                createdAt: data.createdAt,
                createdBy: data.createdBy,
            };
        });

        return {allPosts, lastDoc: lastVisable} ;
    } catch (err) {

    }
}

export default {
    addPost,
    allPosts,
}