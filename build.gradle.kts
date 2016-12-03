
import org.gradle.api.JavaVersion
import org.gradle.api.plugins.JavaPlugin
import org.gradle.api.plugins.JavaPluginConvention
import org.gradle.script.lang.kotlin.*

allprojects {
    repositories {
        jcenter()
        maven {
            setUrl("https://dl.bintray.com/palantir/releases") // docker-compose-rule is published on bintray
        }
    }

    apply {
        plugin<JavaPlugin>()
    }

    configure<JavaPluginConvention> {
        setSourceCompatibility(JavaVersion.VERSION_1_8)
    }
}