import { db } from "../firebaseConfig";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, startAfter, where } from "firebase/firestore";

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

async function toggleFavorite(userId: string, postId: string) {
    try {
        const favoriteRef = doc(db, "users", userId, "favorites", postId);
        const snapshot = await getDoc(favoriteRef);

        if (snapshot.exists()) {
            await deleteDoc(favoriteRef);
            console.log("Unfavorited: ", favoriteRef);
            return { favorited: false };
        } else {
            await setDoc(favoriteRef, {postId, createdAt: serverTimestamp(),});
            console.log("Favorited: ", favoriteRef);
            return { favorited: true };
        } 
    } catch (err) {
        console.error("Failed to add post to favorites", err);
        return { favorited: false };
    }
}

async function getPostCaption(postId: string) {
    const postRef = doc(posts, postId);
    const snapshot = await getDoc(postRef)
    if (!snapshot.exists()) {
        console.error("Post not found:", postId);
        return null;
    }
    const data = snapshot.data();
    return (data.caption);
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

async function favoritePosts(userId: string, pageSize = 25, lastDoc = null) {
    try {
        const favorites = collection(db, "users", userId, "favorites");
        let q;
        if (lastDoc) {
            q = query(
                favorites,
                orderBy("createdAt", "asc"),
                startAfter(lastDoc),
                limit(pageSize),
            );
        } else {
            q = query(
                favorites,
                orderBy("createdAt", "asc"),
                limit(pageSize),
            );
        }
        
        const snapshot = await getDocs(q);
        if (!snapshot || !snapshot.docs || snapshot.docs.length === 0) {
            return { allPosts: [], lastDoc: null };
        }
        const lastVisable = snapshot.docs[snapshot.docs.length - 1];
        
        const allPosts: PostWithId[] = (
            await Promise.all(
                snapshot.docs.map(async (favDoc) => {
                const favData = favDoc.data();
                const postSnap = await getDoc(doc(db, "posts", favData.postId));
                if (!postSnap.exists()) return null;
                    return { id: postSnap.id, ...postSnap.data() } as PostWithId;
                })
            )
        ).filter((p): p is PostWithId => p !== null);

        return {allPosts, lastDoc: lastVisable} ;
    } catch (err) {

    }
}

export default {
    addPost,
    allPosts,
    favoritePosts,
    toggleFavorite,
    getPostCaption,
}