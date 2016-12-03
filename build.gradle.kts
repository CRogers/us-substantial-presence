
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

/*
apply plugin: 'java'


dependencies {
    testCompile 'org.seleniumhq.selenium:selenium-chrome-driver:${seleniumVersion}'

    testCompile 'net.serenity-bdd:serenity-core:${serenityVersion}'
    testCompile 'net.serenity-bdd:serenity-junit:${serenityVersion}'
    testCompile 'net.serenity-bdd:serenity-screenplay:${serenityVersion}'
    testCompile 'net.serenity-bdd:serenity-screenplay-webdriver:${serenityVersion}'

    testCompile 'ch.qos.logback:logback-classic:1.1.7'
    testCompile "com.palantir.docker.compose:docker-compose-rule:${dockerComposeRuleVersion}"
}
*/