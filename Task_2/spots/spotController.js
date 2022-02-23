import pg from 'pg'
import { readFile } from "fs/promises";

const config = JSON.parse(await readFile("config/db_config.json"));

const client = new pg.Client({
    host: config['host'],
    user: config['user'],
    password: config['password'],
})

export async function databaseConnection() {
    await client.connect()
}


export async function getSpotsByParameters(latitude, longitude, radius, type) {
    let query
    if (type == "circle") {
        query =
            `SELECT *,ST_AsText(coordinates) as long_lat,ST_Distance(
        ST_GeometryFromText(ST_AsText(coordinates)),
        ST_GeometryFromText('Point(` + latitude + ` ` + longitude + `)')) as distance
        from "MY_TABLE"
        where ST_Distance(
            ST_GeometryFromText(ST_AsText(coordinates)),
            ST_GeometryFromText('Point(` + latitude + ` ` + longitude + `)')) < ` + radius + `;`
    }
    else if (type == "square") {
        // bottom-left point
        let x1 = latitude - radius
        let y1 = longitude - radius
        // top-right point
        let x2 = latitude + radius
        let y2 = longitude + radius

        query = `SELECT *,ST_AsText(coordinates) as long_lat,ST_Distance(
            ST_GeometryFromText(ST_AsText(coordinates)),
            ST_GeometryFromText('Point(` + latitude + ` ` + longitude + `)')) as distance from "MY_TABLE" where ` + latitude + `>` + x1 + `and ` + latitude + `<` + x2 + ` and ` +
            longitude + `>` + y1 + `and ` + longitude + `<` + y2
    }
    else {
        return { code: 200, data: "type undefined" }

    }
    const result = await client.query(query)
    let sorted = result.rows.sort((a, b) => getDistanceFromLatLonInKm(a.long_lat, b.long_lat) < 50 ? parseFloat(a.rating) - parseFloat(b.rating) : parseFloat(a.distance) - parseFloat(b.distance));
    return { code: 200, data: sorted }
}

function getDistanceFromLatLonInKm(long_lat_a, long_lat_b) {
    let lat1 = parseFloat(long_lat_a.split('(')[1].split(' ')[0]);
    let lon1 = parseFloat(long_lat_a.split(' ')[1].split(')')[0]);
    let lat2 = parseFloat(long_lat_b.split('(')[1].split(' ')[0]);
    let lon2 = parseFloat(long_lat_b.split(' ')[1].split(')')[0]);
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1);
    let dLon = deg2rad(lon2 - lon1);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}